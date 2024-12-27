const express = require('express');
const router = express.Router();
const { Article } = require('../../models')
const { Op } = require('sequelize')

// query article list
router.get('/', async function (req, res, next) {
    try {
        const query = req.query

        // The current page. If not passed, the default is the first page.
        const currentPage = Math.abs(Number(query.currentPage)) || 1
        // How many data items are displayed per page? If not passed, 10 items will be displayed.
        const pageSize = Math.abs(Number(query.pageSize)) || 10

        // Calculating offset
        const offset = (currentPage - 1) * pageSize

        const condition = {
            order: [['id', 'desc']],
            limit: pageSize,
            offset,
        }
        if (query.title) {
            condition.where = {
                title: {
                    [Op.like]: `%${query.title}%`
                }
            }
        }

        // const articles = await Article.findAll(condition)
        const { count, rows } = await Article.findAndCountAll(condition)

        res.json({  // The default status code for success is 200
            status: true,
            message: 'query successfully',
            data: {
                rows,
                pagination: {
                    total: count,
                    currentPage,
                    pageSize
                }
            }
        })
    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'query failed',
            errors: [err.message] // There may be multiple error messages
        })
    }
});

// get article
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params

        // query article
        const article = await Article.findByPk(id)
        if (article) {
            res.json({
                status: true,
                message: "query successfully",
                data: {
                    article
                }
            })
        } else {
            res.status(404).json({
                status: false,
                message: 'article not found',
            })
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'query failed',
            errors: [err.message] // There may be multiple error messages
        })
    }
}).all

// create article
router.post('/', async function (req, res, next) {
    try {
        const article = await Article.create(req.body)
        // 200与201，都是表示成功的处理了请求，但201还有一层意思，它表示同时还创建了新的资源。
        res.status(201).json({
            status: true,
            message: 'create article successfully',
            data: article
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Failed to create the article.',
            errors: [err.message] // There may be multiple error messages
        })
    }
})

// delete article
router.delete('/:id', async function (req, res) {
    try {
        // get article ID
        const { id } = req.params;

        // query article
        const article = await Article.findByPk(id);

        if (article) {
            // delete article
            await article.destroy();

            res.json({
                status: true,
                message: 'delete article successfully'
            });
        } else {
            res.status(404).json({
                status: false,
                message: 'Article not found.',
            });
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Failed to delete the article.',
            errors: [error.message]
        });
    }
});

// update article
router.put('/:id', async function (req, res) {
    try {
        const { id } = req.params;
        const article = await Article.findByPk(id);

        if (article) {
            await article.update(req.body);

            res.json({
                status: true,
                message: 'Updated article successfully.',
                data: article
            });
        } else {
            res.status(404).json({
                status: false,
                message: 'Article not found.',
            });
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Failed to update article.',
            errors: [error.message]
        });
    }
});



module.exports = router;
