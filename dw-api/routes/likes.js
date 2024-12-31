const express = require('express');
const router = express.Router();
const { Course, Like, User } = require('../models');
const { success, failure } = require('../utils/responses');
const { NotFoundError } = require('../utils/errors');

/**
 * 点赞、取消赞
 * POST /likes
 */
router.post('/', async function (req, res) {
    try {
        const userId = req.userId;
        const { courseId } = req.body;

        const course = await Course.findByPk(courseId);
        if (!course) {
            throw new NotFoundError('课程不存在。');
        }

        // 检查课程之前是否已经点赞
        const like = await Like.findOne({
            where: {
                courseId,
                userId
            }
        });

        // 如果没有点赞过，那就新增。并且课程的 likesCount + 1
        if (!like) {
            await Like.create({ courseId, userId });
            await course.increment('likesCount');
            success(res, '点赞成功。')
        } else {
            // 如果点赞过了，那就删除。并且课程的 likesCount - 1
            await like.destroy();
            await course.decrement('likesCount');
            success(res, '取消赞成功。')
        }
    } catch (error) {
        failure(res, error);
    }
});

module.exports = router;
