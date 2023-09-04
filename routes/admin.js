const express = require('express')


const router = express.Router()

const {getUsers, updateUser, getSingleUser} = require('../controllers/admin')


router.route('/').get(getUsers)
router.route('/:id').get(getSingleUser).patch(updateUser)



module.exports = router