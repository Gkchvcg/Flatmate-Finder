import express from 'express';
const router = express.Router();
import propertyController from '../controllers/propertyController.js';
import { protect, optionalProtect } from '../middleware/authMiddleware.js';

const { getProperties, getProperty, createProperty, updateProperty, deleteProperty } = propertyController;

router.route('/')
  .get(optionalProtect, getProperties)
  .post(protect, createProperty);

router.route('/:id')
  .get(optionalProtect, getProperty)
  .put(protect, updateProperty)
  .delete(protect, deleteProperty);

export default router;
