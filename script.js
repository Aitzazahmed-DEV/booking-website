        const SERVICES = [
            { 
                id: 1, 
                name: 'Hair Cut', 
                desc: 'Professional haircut with styling', 
                price: 50, 
                duration: 45, 
                emoji: '💇' 
            },
            { 
                id: 2, 
                name: 'Facial Treatment', 
                desc: 'Complete skincare and facial', 
                price: 75, 
                duration: 60, 
                emoji: '💆' 
            },
            { 
                id: 3, 
                name: 'Massage Therapy', 
                desc: 'Relaxing full body massage', 
                price: 100, 
                duration: 60, 
                emoji: '🧘' 
            },
            { 
                id: 4, 
                name: 'Dental Checkup', 
                desc: 'Regular dental examination', 
                price: 80, 
                duration: 30, 
                emoji: '🦷' 
            },
            { 
                id: 5, 
                name: 'Fitness Consultation', 
                desc: 'Personal training session', 
                price: 60, 
                duration: 45, 
                emoji: '💪' 
            },
            { 
                id: 6, 
                name: 'Photography Session', 
                desc: 'Professional photo shoot', 
                price: 150, 
                duration: 120, 
                emoji: '📸' 
            },
        ];
        const TIME_SLOTS = [
            '09:00', '09:30', '10:00', '10:30',
            '11:00', '11:30', '14:00', '14:30',
            '15:00', '15:30', '16:00', '16:30',
            '17:00', '17:30', '18:00'
        ];
        let bookings = [];              // List of all bookings
        let selectedService = null;     // Currently selected service
        let selectedTime = null;        // Currently selected time
        let currentBookingData = {};    // Data being filled in form
        function loadBookings() {
            const saved = localStorage.getItem('bookings');
            if (saved) {
                bookings = JSON.parse(saved);
            }
        }

        function saveBookings() {
            localStorage.setItem('bookings', JSON.stringify(bookings));
        }

        function renderServices() {
            const grid = document.getElementById('servicesGrid');
            const select = document.getElementById('selectedService');
            grid.innerHTML = '';
            select.innerHTML = '<option value="">Choose a service...</option>';
            SERVICES.forEach(service => {
                const card = document.createElement('div');
                card.className = 'service-card';
                card.innerHTML = `
                    <div class="service-image">${service.emoji}</div>
                    <div class="service-content">
                        <div class="service-name">${service.name}</div>
                        <div class="service-desc">${service.desc}</div>
                        <div class="service-footer">
                            <div>
                                <div class="price">$${service.price}</div>
                                <div class="duration">${service.duration} min</div>
                            </div>
                            <button class="book-service-btn" data-service-id="${service.id}">Book</button>
                        </div>
                    </div>
                `;
                card.querySelector('.book-service-btn').addEventListener('click', (e) => {
                    e.preventDefault();
                    scrollToBooking();
                    document.getElementById('selectedService').value = service.id;
                    loadTimeSlots();
                });
                grid.appendChild(card);

                // ADD TO DROPDOWN MENU
                const option = document.createElement('option');
                option.value = service.id;
                option.textContent = `${service.name} - $${service.price}`;
                select.appendChild(option);
            });
        }

        function loadTimeSlots() {
            const serviceId = document.getElementById('selectedService').value;
            selectedService = SERVICES.find(s => s.id == serviceId);
            
            if (!serviceId) {
                document.getElementById('timeSlots').innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #95a5a6;">Please select a service first</p>';
                return;
            }

            const container = document.getElementById('timeSlots');
            container.innerHTML = '';

            TIME_SLOTS.forEach(time => {
                const slot = document.createElement('div');
                slot.className = 'time-slot';
                slot.textContent = time;

                const isBooked = bookings.some(b => 
                    b.date === document.getElementById('appointmentDate').value && 
                    b.time === time
                );

                if (isBooked) {
                    // If booked, make it disabled (gray and unclickable)
                    slot.classList.add('disabled');
                } else {
                    // If available, make it clickable
                    slot.addEventListener('click', () => selectTime(time, slot));
                }

                container.appendChild(slot);
            });
        }

        /* Handle time slot selection */
        function selectTime(time, element) {
            // Remove selected class from all slots
            document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
            // Add selected class to clicked slot
            element.classList.add('selected');
            selectedTime = time;
        }

        // ========================================
        // FORM VALIDATION
        // Check if user entered valid data
        // ========================================

        /* Check if email is valid */
        function validateEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        /* Check if phone is valid */
        function validatePhone(phone) {
            return /^[\d\s\-\+\(\)]{10,}$/.test(phone);
        }

        /* Remove error messages from form */
        function clearErrors() {
            document.querySelectorAll('.error-message').forEach(el => el.classList.remove('show'));
        }

        /* Validate entire form before submission */
        function validateForm() {
            clearErrors();
            let isValid = true;

            // Check name is not empty
            const name = document.getElementById('fullName').value.trim();
            if (name.length < 2) {
                document.getElementById('nameError').classList.add('show');
                isValid = false;
            }

            // Check email is valid
            const email = document.getElementById('email').value.trim();
            if (!validateEmail(email)) {
                document.getElementById('emailError').classList.add('show');
                isValid = false;
            }

            // Check phone is valid
            const phone = document.getElementById('phone').value.trim();
            if (!validatePhone(phone)) {
                document.getElementById('phoneError').classList.add('show');
                isValid = false;
            }

            // Check service and time selected
            if (!selectedService || !selectedTime) {
                alert('Please select both a service and time slot');
                isValid = false;
            }

            return isValid;
        }

        // ========================================
        // FORM SUBMISSION
        // Handle when user submits booking
        // ========================================

        document.getElementById('bookingForm').addEventListener('submit', (e) => {
            e.preventDefault();  // Stop form from reloading page

            // Validate form first
            if (!validateForm()) return;

            // Create booking object with all details
            const booking = {
                id: Date.now(),                                    // Unique ID
                name: document.getElementById('fullName').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                service: selectedService.name,
                serviceId: selectedService.id,
                date: document.getElementById('appointmentDate').value,
                time: selectedTime,
                notes: document.getElementById('notes').value.trim(),
                status: 'confirmed',
                createdAt: new Date().toISOString()
            };

            currentBookingData = booking;
            bookings.push(booking);       // Add to list
            saveBookings();               // Save to browser

            // Show confirmation modal with booking details
            document.getElementById('confirmName').textContent = booking.name;
            document.getElementById('confirmService').textContent = booking.service;
            document.getElementById('confirmDate').textContent = formatDate(booking.date);
            document.getElementById('confirmTime').textContent = booking.time;
            document.getElementById('confirmEmail').textContent = booking.email;

            showModal('confirmationModal');

            // Clear form for next booking
            document.getElementById('bookingForm').reset();
            selectedService = null;
            selectedTime = null;
            document.getElementById('timeSlots').innerHTML = '';

            // Update admin panel
            updateAdminPanel();

            // Show success message
            const successMsg = document.getElementById('successMsg');
            successMsg.classList.add('show');
            setTimeout(() => successMsg.classList.remove('show'), 3000);
        });

        // ========================================
        // DATE PICKER SETUP
        // Limit dates user can select
        // ========================================

        const dateInput = document.getElementById('appointmentDate');
        const today = new Date();
        const maxDate = new Date(today);
        maxDate.setDate(maxDate.getDate() + 30);  // 30 days from today

        dateInput.min = today.toISOString().split('T')[0];      // Can't book past
        dateInput.max = maxDate.toISOString().split('T')[0];    // Can't book too far

        // Reload time slots when date changes
        dateInput.addEventListener('change', loadTimeSlots);
        document.getElementById('selectedService').addEventListener('change', loadTimeSlots);

        // ========================================
        // MODAL FUNCTIONS
        // Show and hide popup windows
        // ========================================

        /* Show a modal (popup) */
        function showModal(modalId) {
            document.getElementById(modalId).classList.add('show');
        }

        /* Hide a modal (popup) */
        function closeModal(modalId) {
            document.getElementById(modalId).classList.remove('show');
        }

        /* Close modal if user clicks outside it */
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('show');
            }
        });

        // ========================================
        // ADMIN PANEL
        // Manage all bookings
        // ========================================

        /* Update admin panel display */
        function updateAdminPanel() {
            const totalEl = document.getElementById('totalBookings');
            const confirmedEl = document.getElementById('confirmedBookings');
            const listEl = document.getElementById('adminBookingsList');

            // Update statistics
            totalEl.textContent = bookings.length;
            confirmedEl.textContent = bookings.filter(b => b.status === 'confirmed').length;

            // Clear list
            listEl.innerHTML = '';

            // Show each booking (newest first)
            bookings.slice().reverse().forEach(booking => {
                const item = document.createElement('div');
                item.className = 'booking-item';
                item.innerHTML = `
                    <div class="booking-item-header">
                        <div class="booking-item-name">${booking.name}</div>
                        <div class="booking-status status-${booking.status}">${booking.status.toUpperCase()}</div>
                    </div>
                    <div class="booking-details">
                        <p><strong>Service:</strong> ${booking.service}</p>
                        <p><strong>Date:</strong> ${formatDate(booking.date)} at ${booking.time}</p>
                        <p><strong>Email:</strong> ${booking.email}</p>
                        <p><strong>Phone:</strong> ${booking.phone}</p>
                        ${booking.notes ? `<p><strong>Notes:</strong> ${booking.notes}</p>` : ''}
                    </div>
                    <div class="admin-actions">
                        <button class="admin-btn btn-confirm" onclick="updateBookingStatus(${booking.id}, 'confirmed')">Confirm</button>
                        <button class="admin-btn btn-delete" onclick="deleteBooking(${booking.id})">Delete</button>
                    </div>
                `;
                listEl.appendChild(item);
            });
        }

        /* Update booking status */
        function updateBookingStatus(id, status) {
            const booking = bookings.find(b => b.id === id);
            if (booking) {
                booking.status = status;
                saveBookings();
                updateAdminPanel();
            }
        }

        /* Delete a booking */
        function deleteBooking(id) {
            if (confirm('Are you sure you want to delete this booking?')) {
                bookings = bookings.filter(b => b.id !== id);
                saveBookings();
                updateAdminPanel();
            }
        }

        // ========================================
        // ADMIN PANEL TOGGLE
        // Show/hide admin panel
        // ========================================

        document.getElementById('adminToggleBtn').addEventListener('click', () => {
            document.getElementById('adminPanel').classList.add('show');
            updateAdminPanel();
        });

        document.getElementById('adminCloseBtn').addEventListener('click', () => {
            document.getElementById('adminPanel').classList.remove('show');
        });

        // ========================================
        // BOOKING BUTTON EVENTS
        // Navigate to booking form when clicked
        // ========================================

        function scrollToBooking() {
            document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
        }

        document.getElementById('headerBookBtn').addEventListener('click', scrollToBooking);
        document.getElementById('heroBookBtn').addEventListener('click', scrollToBooking);

        // ========================================
        // UTILITY FUNCTIONS
        // Helper functions
        // ========================================

        /* Format date nicely (e.g., "Jan 15, 2024") */
        function formatDate(dateStr) {
            const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
            return new Date(dateStr).toLocaleDateString('en-US', options);
        }

        // ========================================
        // INITIALIZATION
        // Run when page loads
        // ========================================

        document.addEventListener('DOMContentLoaded', () => {
            loadBookings();        // Load saved bookings
            renderServices();      // Show all services
            updateAdminPanel();    // Update admin display
        });

        /* Smooth scroll for navigation links */
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });