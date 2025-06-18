import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    completed: { type: Boolean, default: false },
    group: { type: String }, // Ex: lista de compras
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', TaskSchema);
export default Task;
