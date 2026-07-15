const Complaint = require("../models/Complaint");

// Create a new complaint
const createComplaint = async (req, res) => {
  try {
    const { title, description, customer, priority } = req.body;

    const complaint = await Complaint.create({
      title,
      description,
      customer,
      priority,
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all complaints (with optional filters: status, priority, date range)
const getComplaints = async (req, res) => {
  try {
    const { status, priority, from, to } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const complaints = await Complaint.find(filter)
      .populate("customer", "name email")
      .populate("agent", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single complaint by ID
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate("customer", "name email").populate("agent", "name email");

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update complaint (status, priority, agent assignment, etc.)
const updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.title = req.body.title || complaint.title;
    complaint.description = req.body.description || complaint.description;
    complaint.status = req.body.status || complaint.status;
    complaint.priority = req.body.priority || complaint.priority;
    complaint.agent = req.body.agent || complaint.agent;

    const updatedComplaint = await complaint.save();
    res.status(200).json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete complaint
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    await complaint.deleteOne();
    res.status(200).json({ message: "Complaint deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get analytics/stats (for admin dashboard)
const getStats = async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const pendingCount = await Complaint.countDocuments({ status: "pending" });
    const inProgressCount = await Complaint.countDocuments({ status: "in-progress" });
    const resolvedCount = await Complaint.countDocuments({ status: "resolved" });

    const highPriority = await Complaint.countDocuments({ priority: "high" });
    const mediumPriority = await Complaint.countDocuments({ priority: "medium" });
    const lowPriority = await Complaint.countDocuments({ priority: "low" });

    const Feedback = require("../models/Feedback");
    const feedbacks = await Feedback.find();
    const avgRating =
      feedbacks.length > 0
        ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
        : 0;

    res.status(200).json({
      totalComplaints,
      pendingCount,
      inProgressCount,
      resolvedCount,
      highPriority,
      mediumPriority,
      lowPriority,
      avgRating,
      totalFeedbacks: feedbacks.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  getStats,
};