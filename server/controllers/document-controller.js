const DocumentModel = require("../schema/Document-Schema")
const userModel = require("../schema/User-Schema")
const mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;


const getDocument = async (documentId, userId) => {
	try {
		if (documentId === null) return;

		const document = await DocumentModel.findById(documentId)

		const user = await userModel.findById(userId)

		if (document) {
			const filter = user?.documents.filter((doc) => doc === documentId)
			console.log(filter)
			if (filter?.length == 0) {
				user ? user.documents.push(documentId) : ""
			}
			await user?.save()
			return document;
		}
		else {
			const newdocument = await DocumentModel.create({ _id: documentId, data: "" })
			user.documents.push(documentId)
			await user.save()
			return newdocument;
		}
	} catch (error) {
		return error;
	}
}

const updateDocument = async (id, data) => {
	try {
		return await DocumentModel.findByIdAndUpdate(id, { data })
	} catch (error) {
		return error;
	}
}

const DocumentForUser = async (req, res) => {
	try {
		const user = await userModel.findById(req.params.id).exec();
		if (!user) {
			return res.status(401).json({ error: "Invalid user ID" });
		}
		const documents = await DocumentModel.find({ _id: { $in: user.documents } }).exec();
		return res.send(documents);
	} catch (error) {
		return res.status(404).json({ error: "Something went wrong" });
	}
};

const DocumentName = async (req, res) => {
	try {
		const document = await DocumentModel.findByIdAndUpdate(req.params.id, { name: req.body.docName }, { new: true });
		if (!document) {
			return res.status(404).json({ error: "Document not found" });
		}
		return res.status(200).json({ message: "Name updated" });
	} catch (error) {
		return res.status(404).json({ error: "Something went wrong" });
	}
};

const GetName = async (req, res) => {
	try {
		const document = await DocumentModel.findById(req.params.id)
		if (!document) {
			return res.status(404).json({ error: "Document not found" });
		}
		return res.status(200).send({ name: document.name });
	} catch (error) {
		return res.status(404).json({ error: "Something went wrong" });
	}
}

const deleteDocument = async (req, res) => {
	try {
		const currentUser = await userModel.findById(req.body.userId);
		if (!currentUser) {
			return res.status(404).json({ error: "Current user not found" });
		}

		currentUser.documents.pull(req.params.id);
		await currentUser.save();

		return res.status(200).json({ message: "Document deleted Successfully" });
	} catch (error) {
		return res.status(404).json({ error: "Something went wrong" });
	}
}

module.exports = { getDocument, updateDocument, DocumentForUser, DocumentName, GetName, deleteDocument }