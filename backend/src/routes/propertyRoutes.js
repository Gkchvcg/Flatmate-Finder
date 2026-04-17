import express from 'express';
const router = express.Router();
import propertyController from '../controllers/propertyController.js';
import { protect } from '../middleware/authMiddleware.js';

const { getProperties, getProperty, createProperty, updateProperty, deleteProperty } = propertyController;

router.route('/')
  .get(getProperties)
  .post(protect, createProperty);

router.route('/:id')
  .get(getProperty)
  .put(protect, updateProperty)
  .delete(protect, deleteProperty);

export default router;
