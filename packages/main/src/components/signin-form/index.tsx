import { Button } from "@doar/components";
import { login } from "../../auth/authService";

import {
    StyledWrap,
    StyledTitle,
    StyledDesc,
    StyledDivider,
    StyledBottomText,
} from "./style";

const SigninForm = () => {
    return (
        <StyledWrap>
            <StyledTitle>Sign In</StyledTitle>

            <StyledDesc>
                Welcome back! Please sign in to continue.
            </StyledDesc>

            <Button
                type="button"
                color="brand2"
                fullwidth
                onClick={() => login()}
            >
                Sign In
            </Button>

            <StyledDivider>or</StyledDivider>

            <Button
                variant="outlined"
                color="facebook"
                fullwidth
            >
                Sign In With Facebook
            </Button>

            <Button
                variant="outlined"
                color="twitter"
                mt="0.5rem"
                fullwidth
            >
                Sign In With Twitter
            </Button>

            <StyledBottomText>
                Don&apos;t have an account?{" "}
                <a href="/signup">
                    Create an Account
                </a>
            </StyledBottomText>
        </StyledWrap>
    );
};

export default SigninForm;