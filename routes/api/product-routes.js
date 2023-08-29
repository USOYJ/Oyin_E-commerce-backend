const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');


router.get('/', async (req, res) => {
try {
  const productsData = await Product.findAll({
    include: [{ model: Category },{ model: Tag }]
  });
  res.status(200).json(productsData);
}catch (err) {
  res.status(500).json(err);
}
});


router.get('/:id', async (req, res) => {
try {
  const singleProductData = await Product.findByPk(req.params.id, {
    include: [{ model: Category },{ model: Tag }]
  });

  if (!singleProductData) {
    res.status(404).json({ message: 'No Product was found with that id!' });
    return;
  }

  res.status(200).json(singleProductData);  
} catch (err) { 
  res.status(500).json(err);  
}
});


router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body, {
      where: {
        id: req.params.id,
      },
    });
    
    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => ({ 
        product_id: product.id,
        tag_id,
      }));
      await ProductTag.bulkCreate(productTagIdArr);
    }

    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
}); 

router.put('/:id', async (req, res) => {
  await Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))  
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags)) 
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
try {
  const productData = await Product.destroy({ 
    where: {  
      id: req.params.id,  
    },  
  }); 

  if (!productData) {
    res.status(404).json({ message: 'No Product was found with that id!' });
    return;
  }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  } 
});




module.exports = router;
