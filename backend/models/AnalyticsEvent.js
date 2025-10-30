import mongoose from 'mongoose';

const AnalyticsEventSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['pageview', 'signup'] },
  path: { type: String },
  referrer: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userAgent: { type: String },
  ip: { type: String },
}, { timestamps: true });

export default mongoose.model('AnalyticsEvent', AnalyticsEventSchema);


