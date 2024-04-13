const { generateToken } = require("../config/jwtToken");
const User = require("../models/userModel");
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require("../utils/validateMongodbid");
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require("jsonwebtoken");
//rgister
const createUser = asyncHandler(
    async (req, res) => {
        const email = req.body.email;
        const mobile = req.body.mobile;
        const findUser = await User.findOne({ $or: [{ email: email }, { mobile: mobile }] });
        if (!findUser) {
            const newUser = await User.create(req.body);
            res.json(newUser);
        } else {
            if (findUser.email === email) {

                throw new Error('User Email Id Already Registered')

            } else if (findUser.mobile === mobile) {

                throw new Error('User Mobile Already Registered')
            }
        }
    }
);

//login
const loginUserCtrl = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email });
    if (findUser && (await findUser.isPasswordMatched(password))) {
        const refreshToken = await generateRefreshToken(findUser?._id);
        const updateuser = await User.findByIdAndUpdate(
            findUser.id, {
            refreshToken: refreshToken,
        }, {
            new: true
        }
        );
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        })
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            password: findUser?.password,
            role: findUser?.role,
            token: generateToken(findUser?._id)
        });
    } else {
        throw new Error('Invalid Credentials');
    }
});


//get all users
const getAllUser = asyncHandler(async (req, res) => {
    try {
        const getUser = await User.find();
        res.json({ getUser })
    } catch (error) {
        throw new Error(error)
    }
})

const getSingleUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id)
    try {
        const getSingleUser = await User.findById(_id)
        res.json({ getSingleUser })
    } catch (error) {

    }
})

const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id)
    try {
        const updateUser = await User.findByIdAndUpdate(
            _id, {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile,
        },
            {
                new: true
            })
        res.json({ updateUser })
    } catch (error) {
        throw new Error(error)
    }
})

const deleteUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id)
    try {
        const deleteUser = await User.findByIdAndDelete(_id)
        res.json({ deleteUser })
    } catch (error) {
        throw new Error(error)
    }
})

const blockUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id)
    try {
        const block = await User.findByIdAndUpdate(
            _id, {
            isBlocked: true
        }, {
            new: true
        }
        );
        res.json({
            block,
            message: "User Blocked"
        })
    } catch (error) {
        throw new Error(error)
    }
})

const unblockUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id)
    try {
        const unblock = await User.findByIdAndUpdate(
            id, {
            isBlocked: false
        },
            {
                new: true
            }
        );
        res.json({
            unblock,
            message: "User Unblocked"
        })
    } catch (error) {
        throw new Error(error)
    }
})


const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("There is no Refresh Token");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error("There is no Refresh Token present in db or not matched");
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error('There is something worng with refresh token')
        }
        const accessToken = generateToken(user?._id)
        res.json({ accessToken });
    })
})


const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("There is no Refresh Token");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true
        });
        return res.sendStatus(204);
    }
    await User.findOneAndUpdate({ refreshToken: refreshToken }, {
        refreshToken: "",
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    });
    res.sendStatus(204);
});

module.exports = { createUser, loginUserCtrl, getAllUser, getSingleUser, deleteUser, updateUser, blockUser, unblockUser, handleRefreshToken, logout };
