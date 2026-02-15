import mongoose from 'mongoose';

const AchievementSchema = new mongoose.Schema({
    achievementId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: '🏆'
    },
    category: {
        type: String,
        enum: ['milestone', 'streak', 'performance'],
        required: true
    },
    tier: {
        type: String,
        enum: ['bronze', 'silver', 'gold', 'platinum'],
        default: 'bronze'
    },
    xpReward: {
        type: Number,
        default: 0
    },
    requirements: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for efficient queries
AchievementSchema.index({ achievementId: 1 });
AchievementSchema.index({ category: 1 });
AchievementSchema.index({ tier: 1 });

export default mongoose.model('Achievement', AchievementSchema);
