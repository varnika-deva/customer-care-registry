const Feedback = require("../models/Feedback");
const Complaint = require("../models/Complaint");

// Create feedback for a resolved complaint
const createFeedback = async (req, res) => {
  try {
    const { complaint, rating, comment } = req.body;

    const complaintExists = await Complaint.findById(complaint);
    if (!complaintExists) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    const feedback = await Feedback.create({
      complaint,
      customer: req.user.id,
      rating,
      comment,
    });

    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all feedback (admin/agent use)
const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("complaint", "title status")
      .populate("customer", "name email");

    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createFeedback,
  getFeedbacks,
};