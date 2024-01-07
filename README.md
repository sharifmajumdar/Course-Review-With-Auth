#A backend project using typescript, express and mongoose for mongodb

## Course review system

An online based course review system (backend) where the aim was to design a sample CRUD operation APIs with proper validation.

# Technology used

1. Node
2. Express
3. MongoDB
4. Mongoose
5. TypeScript

# Features

1. Create a course
2. Get all courses with filtering
3. Get single course with review
4. Update a course
5. Get best course by rating
6. Create a category
7. Get all categories
8. Create a review

# Design patter

In this project, the moduler patter has been applied

# Validation

There are three layer validation like typescript, mongoose and zod. All four types of possible errors are simplied like zodError, validationError, castError, 11000, appError, Error, uncaught, and unhandle.

# List of routes:

Create a course: POST[thttp://localhost:5000/api/course]
Get all courses: GET[http://localhost:5000/api/courses?query]
Get review for a specific course: GET[http://localhost:5000/api/courses/:courseId/reviews]
Get best course: GET[http://localhost:5000/api/course/best]
Update a course: PUT[http://localhost:5000/api/courses/:courseId]
Create a category: POST[http://localhost:5000/api/categories]
Get all categories: GET[http://localhost:5000/api/categories]
Create a review: POST[http://localhost:5000/api/reviews]

# Running instruction

Since it is just a backend APIs design, it would be worth to use locally in order to get the better experience. For instance, there are some external apps like postman, insomnia ans so on to test the sample APIs. So, according to the above routes, the designs APIs could be tested locally.

GitHub link: https://github.com/Porgramming-Hero-web-course/l2b2a4-course-review-with-auth-sharifmajumdar
Deployed link: https://l2-b2-a4-course-review-with-auth.vercel.app/
