const User = require('../models/auth')
const {StatusCodes} = require('http-status-codes')
const { BadRequestError, NotFoundError,UnauthorizedError } = require('../errors')
const { roles } = require('../utils/constants');


const getUsers = async (req, res) => {
    const users = await User.find({})

    if (users.length === 0) {
        throw new NotFoundError('No users found');
    }

    return res.status(StatusCodes.OK).json(users)
}


const getSingleUser = async (req, res) => {

    const {     
        params: { id: userId },
      } = req
    
      const user = await User.findOne({
        _id: userId,
        
      })

      if (!user) {
        throw new NotFoundError(`No user with id ${userId}`)
      }
      res.status(StatusCodes.OK).json({ user })
}


const updateUser = async (req, res) => {

    const {
        body: {role },
        params: {id:updateuserId},
    } = req

    if (!role){
        throw new BadRequestError('please provide the credentials')
    }

    const rolesArray = Object.values(roles)
    if (!rolesArray.includes(role)) {
        throw new BadRequestError('provide valid role')
    }

    if (req.user.userId === updateuserId) {
        throw new UnauthorizedError('Admins cannot remove themselves from Admin, ask another admin.')
      }

    const user = await User.findByIdAndUpdate({
        _id: updateuserId,
    },
        req.body,
        { new: true, runValidators: true }
        )
    if (!user){
        throw new NotFoundError(`No recipe with ${updateuserId}`)
    }

    res.status(StatusCodes.OK).json({user})
}


module.exports = {getUsers, getSingleUser, updateUser}