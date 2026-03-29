"use client";

const MOCK_BOOKINGS = [
  { id: "EXO-101", guest: "Pavitra Kumar", email: "pavitra@example.com", room: "Garden AC Cottage 01", checkIn: "2026-03-23", checkOut: "2026-03-26", status: "Confirmed", amount: 13500, date: "2026-03-10" },
  { id: "EXO-102", guest: "Sarah Miller", email: "sarah@example.com", room: "Garden AC Cottage 04", checkIn: "2026-03-25", checkOut: "2026-03-29", status: "Pending", amount: 20800, date: "2026-03-09" },
  { id: "EXO-103", guest: "Rahul Sharma", email: "rahul@example.com", room: "Garden AC Cottage 02", checkIn: "2026-03-24", checkOut: "2026-03-25", status: "Confirmed", amount: 5200, date: "2026-03-08" },
  { id: "EXO-104", guest: "Emma Watson", email: "emma@example.com", room: "Garden AC Cottage 06", checkIn: "2026-03-28", checkOut: "2026-03-31", status: "Cancelled", amount: 15600, date: "2026-03-07" },
  { id: "EXO-105", guest: "John Doe", email: "john@example.com", room: "Garden AC Cottage 03", checkIn: "2026-04-01", checkOut: "2026-04-05", status: "Pending", amount: 18000, date: "2026-03-06" },
];

export const getAllBookings = () => {
  if (typeof window === "undefined") return MOCK_BOOKINGS;
  
  const saved = localStorage.getItem("exotica_bookings");
  if (!saved) {
    localStorage.setItem("exotica_bookings", JSON.stringify(MOCK_BOOKINGS));
    return MOCK_BOOKINGS;
  }
  
  try {
    return JSON.parse(saved);
  } catch (e) {
    console.error("Failed to parse bookings", e);
    return MOCK_BOOKINGS;
  }
};

export const saveBooking = (bookingData) => {
  if (typeof window === "undefined") return;

  const bookings = getAllBookings();
  const newBooking = {
    ...bookingData,
    id: `EXO-${Math.floor(10000 + Math.random() * 90000)}`,
    status: "Confirmed", // Default for paid bookings
    date: new Date().toISOString().split('T')[0],
  };

  const updatedBookings = [newBooking, ...bookings];
  localStorage.setItem("exotica_bookings", JSON.stringify(updatedBookings));
  return newBooking;
};

export const updateBookingStatus = (id, status) => {
  if (typeof window === "undefined") return;

  const bookings = getAllBookings();
  const updatedBookings = bookings.map(b => 
    b.id === id ? { ...b, status } : b
  );
  
  localStorage.setItem("exotica_bookings", JSON.stringify(updatedBookings));
  return updatedBookings;
};
