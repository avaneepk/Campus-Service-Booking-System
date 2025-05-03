# Simulated booking inputs from frontend form using team member names

bookings = [
    {
        "name": "Junash Giri",
        "email": "junash.giri@example.com",
        "booking_type": "Meeting Room",
        "item": "Meeting Room A",
        "date": "2025-05-03",
        "time_slot": "15:00 - 16:00"
    },
    {
        "name": "Kristian Lalev",
        "email": "kristian.lalev@example.com",
        "booking_type": "Karaoke",
        "item": "Karaoke Room",
        "date": "2025-05-04",
        "time_slot": "17:30 - 18:30"
    },
    {
        "name": "Shafim Raiyan",
        "email": "shafim.raiyan@example.com",
        "booking_type": "Ping Pong",
        "item": "Ping Pong Table",
        "date": "2025-05-06",
        "time_slot": "14:00 - 15:00"
    },
    {
        "name": "Anuj Rathee",
        "email": "anuj.rathee@example.com",
        "booking_type": "Sauna",
        "item": "Sauna Room",
        "date": "2025-05-05",
        "time_slot": "19:00 - 20:00"
    },
    {
        "name": "Tomi Virtanen",
        "email": "tomi@uni.fi",
        "booking_type": "Music Band Room",
        "item": "Band Room 3",
        "date": "2025-05-09",
        "time_slot": "10:00 - 12:00"
    },
    {
        "name": "Nina White",
        "email": "nina@campus.com",
        "booking_type": "Board Game",
        "item": "Board Game Corner",
        "date": "2025-05-10",
        "time_slot": "13:00 - 15:00"
    },
    {
        "name": "Leo K.",
        "email": "leo@example.com",
        "booking_type": "Pool Table",
        "item": "Pool Table 1",
        "date": "2025-05-11",
        "time_slot": "17:00 - 18:00"
    },
    {
        "name": "Anna Makinen",
        "email": "anna@school.fi",
        "booking_type": "Hot Tub",
        "item": "Hot Tub Zone",
        "date": "2025-05-12",
        "time_slot": "16:00 - 17:00"
    },
    {
        "name": "Ravi Hussle",
        "email": "ravi@example.com",
        "booking_type": "Movie Theatre",
        "item": "Theatre 1",
        "date": "2025-05-13",
        "time_slot": "19:00 - 21:00"
    },
    {
        "name": "Avaneep Kamal",
        "email": "avaneep.kamal@example.com",
        "booking_type": "Board Game",
        "item": "Board Game Corner",
        "date": "2025-05-07",
        "time_slot": "13:30 - 14:30"
    }
]


if __name__ == "__main__":
    for booking in bookings:
        print(booking)
