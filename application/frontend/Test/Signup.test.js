import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import Signup from "../src/Signup/Signup.js";
import { makeProfile } from "../src/Profile/profileService.js";
import { signupUser } from "../src/Signup/registerService.js";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter, Routes, Route, BrowserRouter as Router } from "react-router-dom";

jest.mock("../src/Signup/registerService.js", () => ({
    signupUser: jest.fn(),
}));

jest.mock("../src/Profile/profileService.js", () => ({
    makeProfile: jest.fn(),
}));

describe('Signup', () => {
    it('renders without crashing', () => {
        render(
            <Router>
            <Signup />
        </Router>
        );
    });

    it('calls signupUser and makeProfile on form submission', async () => {
        signupUser.mockResolvedValueOnce();
        makeProfile.mockResolvedValueOnce();

        const { getByLabelText, getByText } = render(
            <MemoryRouter initialEntries={["/signup"]}>
            <Routes>
                <Route path="/signup" element={<Signup />} />
            </Routes>
        </MemoryRouter>
        );

        fireEvent.change(getByLabelText("Name:"), { target: { value: "Test Test"} });
        fireEvent.change(getByLabelText("Username:"), { target: { value: 'testuser' } });
        fireEvent.change(getByLabelText("Age:"), { target: { value: '20' } });
        fireEvent.change(getByLabelText("Email:"), { target: { value: "test@email.com"} });
        fireEvent.change(getByLabelText("Password:"), { target: { value: "password"} });
        fireEvent.change(getByLabelText("Confirm Password:"), { target: { value: "password"} });

        fireEvent.click(getByText('Register'));

        await waitFor(() => {
            expect(signupUser).toHaveBeenCalledWith({
                name: "Test Test",
                age: 20,
                username: "testuser",
                email: "test@email.com",
                password: "password",
            });
            expect(makeProfile).toHaveBeenCalledWith({
                username: "testuser",
                bio: "",
                cookingExperience: "",
                allergies: "",
                foodPreference: "",
                profileImage: "https://res.cloudinary.com/dbspkj6dy/image/upload/v1714813803/x36i4iozmkqsdpxwakq2.jpg",
            });
        });
    });
});

