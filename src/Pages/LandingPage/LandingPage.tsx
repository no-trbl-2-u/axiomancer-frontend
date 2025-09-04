import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";

const LandingPageImage = styled.div`
    background-image: url('/images/landing-page.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    height: 100vh;
    width: 100%;
    cursor: pointer;
`;

function LandingPage() {
    const navigate = useNavigate();
    return (
        <LandingPageImage onClick={() => navigate('/login')} />
    )
}

export default LandingPage;