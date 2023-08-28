const router = require('express').Router();
const { Category, Product } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const categoriesData = await Category.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(categoriesData);
  } catch (err) {
    console.error(err); 
    res.status(500).json({ error: 'An error occurred while fetching categories.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const singleCategoryData = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });
    if (!singleCategoryData) {
      res.status(404).json({ message: 'No category was found with that id!' });
      return;
    }
    res.status(200).json(singleCategoryData);
  } catch (err) {
    console.error(err); 
    res.status(500).json({ error: 'An error occurred while fetching the category.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(201).json(newCategory);
  } catch (err) {
    console.error(err); 
    res.status(400).json({ error: 'Failed to create a new category.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedCategory = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (updatedCategory[0] === 0) {
      res.status(404).json({ message: 'No category found with that id!' });
      return;
    }
    res.status(200).json({ message: 'Category updated successfully.' });
  } catch (err) {
    console.error(err); 
    res.status(500).json({ error: 'An error occurred while updating the category.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedCategoryCount = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (deletedCategoryCount === 0) {
      res.status(404).json({ message: 'No category found with that id!' });
      return;
    }
    res.status(200).json({ message: 'Category deleted successfully.' });
  } catch (err) {
    console.error(err); 
    res.status(500).json({ error: 'An error occurred while deleting the category.' });
  }
});

module.exports = router;
