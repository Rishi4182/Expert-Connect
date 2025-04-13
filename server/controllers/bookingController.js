const Booking = require('../models/bookingModel')
const Expert = require('../models/expertModel')
const expressAsyncHandler = require('express-async-handler')

const bookAppointment = expressAsyncHandler(async(req, res) => {
    const {expertId, date, StartTime,EndTime} = req.body
    const userId = req.user.id

    try {
        const alreadyBooked = await Booking.findOne({expertId, date, StartTime,EndTime})
        if (alreadyBooked) return res.status(400).send({message: "Slot already booked"})

        const newBooking = await Booking.create({
            userId, expertId, date, StartTime,EndTime
        })
        res.send({message: "Booked appointment", payload: newBooking})
    } catch(err) {
        res.status(500).send({message: "Booking failed", payload: err.message})
    }
})

const getUserBookings = expressAsyncHandler(async(req, res) => {
    try {
        const bookings = await Booking.find({userId: req.user.id}).populate('expertId')
        res.send({payload: bookings})
    } catch(err) {
        res.status(500).send({message: "Error fetching user bookings"})
    }
})

const getExpertBookings = expressAsyncHandler(async(req, res) => {
    try {
        const expert = await Expert.findOne({userId: req.user.id})
        if (!expert) return res.status(404).send({message: "Expert profile not found"})

        const bookings = await Booking.find({expertId: expert._id}).populate("userId")
        res.send({payload: bookings})
    } catch(err) {
        res.status(500).send({message: "Error fetching expert bookings"})
    }
})

module.exports = {bookAppointment, getUserBookings, getExpertBookings}