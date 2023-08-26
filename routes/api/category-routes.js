const router = require('express').Router();
const { Category, Product } = require('../../models');

router.get('/', async (req, res) => {
try {
  const categoriesData = await Category.findAll({
    include: [{ model: Product }]
  });
  res.status(200).json(categoriesData); 
} catch (err) {
  res.status(500).json(err);
}
});

router.get('/:id',async (req, res) => {
try {
  const singleCategoryData = await Category.findByPk(req.params.id, {
    include: [{ model: Product }]
  });
  if (!singleCategoryData) {
    res.status(404).json({ message: 'No Category was found with that id!' });
    return;
  }
  res.status(200).json(singleCategoryData);
} catch (err) {
  res.status(500).json(err);  
}
});

router.post('/', async (req, res) => {
await Category.create(req.body)
  .then((category) => {
    res.status(200).json(category);
  })  
  .catch((err) => { 
    console.log(err); 
    res.status(400).json(err);  
  }); 
}); 


router.put('/:id', async(req, res) => {
await Category.update(req.body)
  .then((category) => {
    res.status(200).json(category);
  }) 
});

router.delete('/:id', async (req, res) => {
 try {
   const singleCategoryData = await Category.destroy({
     where: {
       id: req.params.id
     }
   });
   if (!singleCategoryData) {
     res.status(404).json({ message: 'No Category found with that id!' });
     return;
   }
   res.status(200).json(singleCategoryData);
 } catch (err) {
   res.status(500).json(err);
 }  
});

module.exports = router;
