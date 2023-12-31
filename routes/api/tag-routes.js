const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const tagsData = await Tag.findAll({
      include: [{ model: Product }]
    });
    res.status(200).json(tagsData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const singleTagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, through: ProductTag }]
    });
    if (!singleTagData) {
      res.status(404).json({ message: 'No tag was found with that id!' });
      return;
    }
    res.status(200).json(singleTagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const tag = await Tag.create(req.body); 

    res.status(200).json(tag); 
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const [affectedRowsCount, affectedRows] = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (affectedRowsCount > 0) {
      res.status(200).json(affectedRows);
    } else {
      res.status(404).json({ message: 'Tag not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const singleTagData = await Tag.destroy({
      where: {
        id: req.params.id
      }
    });
    if (!singleTagData) {
      res.status(404).json({ message: 'No tag found with that id!' });
      return;
    }
    res.status(200).json(singleTagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
