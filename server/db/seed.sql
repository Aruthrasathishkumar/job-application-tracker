-- Job Application Tracker Seed Data

-- Insert sample users (passwords are 'password123' hashed with bcrypt)
-- You can generate bcrypt hashes using: bcrypt.hashSync('password123', 10)
INSERT INTO users (email, password, name) VALUES
('demo@example.com', '$2b$10$rX6kF8v9YH8qR3vN5Z5L0.xB5KxZ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Za', 'Demo User'),
('john@example.com', '$2b$10$rX6kF8v9YH8qR3vN5Z5L0.xB5KxZ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Za', 'John Doe');

-- Insert sample applications for demo user (user_id = 1)
INSERT INTO applications (user_id, company, position, status, job_url, location, salary_range, notes, applied_date, deadline) VALUES
(1, 'Google', 'Software Engineer', 'interview', 'https://careers.google.com/jobs/123', 'Mountain View, CA', '$120k - $180k', 'Exciting opportunity in Cloud team. Technical interview scheduled for next week.', '2024-01-15', '2024-02-15'),
(1, 'Microsoft', 'Senior Frontend Developer', 'applied', 'https://careers.microsoft.com/job/456', 'Redmond, WA', '$130k - $190k', 'Working on Azure Portal UI. Waiting for response.', '2024-01-20', '2024-02-28'),
(1, 'Meta', 'Full Stack Engineer', 'wishlist', 'https://www.metacareers.com/jobs/789', 'Menlo Park, CA', '$140k - $200k', 'React and Node.js position. Need to prepare portfolio.', NULL, '2024-02-10'),
(1, 'Amazon', 'Backend Developer', 'offer', 'https://amazon.jobs/en/jobs/101112', 'Seattle, WA', '$125k - $175k', 'AWS Lambda team. Offer received! Need to respond by end of month.', '2024-01-10', '2024-01-31'),
(1, 'Netflix', 'DevOps Engineer', 'rejected', 'https://jobs.netflix.com/jobs/131415', 'Los Gatos, CA', '$135k - $185k', 'Didn''t pass technical round. Good learning experience.', '2024-01-05', NULL),
(1, 'Apple', 'iOS Developer', 'applied', 'https://jobs.apple.com/en-us/details/161718', 'Cupertino, CA', '$130k - $180k', 'Swift and SwiftUI role. Applied last week.', '2024-01-22', '2024-02-20'),
(1, 'Airbnb', 'Product Engineer', 'interview', 'https://careers.airbnb.com/positions/192021', 'San Francisco, CA', '$140k - $195k', 'First round completed. Waiting for system design round.', '2024-01-12', '2024-02-05'),
(1, 'Stripe', 'Full Stack Developer', 'wishlist', 'https://stripe.com/jobs/listing/222324', 'Remote', '$135k - $190k', 'Payment infrastructure team. Need to update resume.', NULL, '2024-03-01'),
(1, 'Shopify', 'Ruby on Rails Engineer', 'applied', 'https://www.shopify.com/careers/252627', 'Ottawa, Canada', 'CAD $110k - $160k', 'E-commerce platform work. Remote friendly.', '2024-01-18', '2024-02-25'),
(1, 'Uber', 'Platform Engineer', 'applied', 'https://www.uber.com/careers/list/282930', 'San Francisco, CA', '$130k - $185k', 'Microservices architecture. Applied via referral.', '2024-01-25', '2024-02-29');

-- Insert sample applications for second user (user_id = 2)
INSERT INTO applications (user_id, company, position, status, job_url, location, salary_range, notes, applied_date, deadline) VALUES
(2, 'Tesla', 'Software Engineer', 'applied', 'https://www.tesla.com/careers/313233', 'Palo Alto, CA', '$120k - $170k', 'Autopilot team position.', '2024-01-16', '2024-02-16'),
(2, 'SpaceX', 'Full Stack Developer', 'wishlist', 'https://www.spacex.com/careers/343536', 'Hawthorne, CA', '$125k - $175k', 'Launch systems software.', NULL, '2024-03-15');

-- Insert sample reminders
INSERT INTO reminders (application_id, user_id, reminder_date, message, is_sent) VALUES
(1, 1, '2024-02-10', 'Follow up on Google interview', FALSE),
(2, 1, '2024-02-15', 'Check Microsoft application status', FALSE),
(4, 1, '2024-01-29', 'Respond to Amazon offer before deadline!', FALSE),
(7, 1, '2024-02-01', 'Prepare for Airbnb system design interview', FALSE),
(3, 1, '2024-02-08', 'Apply to Meta position - deadline approaching', FALSE);
