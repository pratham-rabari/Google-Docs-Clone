const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userModel = require("../schema/User-Schema")
const SECRET_KEY = "secretkey"

const register = async (req, res) => {
	try {
		const { username, email, password} = req.body
		const hashedPassword = await bcrypt.hash(password, 10)
		const newUser = new userModel({ username, email,password: hashedPassword })
		await newUser.save()
		res.status(201).send(newUser)
	} catch (error) {
		res.status(500).json({ error: error })
	}
}

const login = async (req, res) => {
	try {
		const { email, password } = req.body
		const user = await userModel.findOne({ email })
		if (!user) {
			return res.status(401).json({ error: "inavalid detail" })
		}
		const isPasswordValid = await bcrypt.compare(password, user.password)
		if (!isPasswordValid) {
			return res.status(401)
		}
		const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '24hr' })
		return res.status(201).send((token, user))

	} catch (error) {
		res.status(500).json({ error: "error in login" })
	}
}

module.exports = {
    register,
    login
}