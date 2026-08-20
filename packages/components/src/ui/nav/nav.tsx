import { Children, isValidElement, FunctionComponent } from "react";
import classnames from "clsx";
import { FlexboxProps, SpaceProps, TypographyProps } from "@doar/shared/styled";
import { StyledNav } from "./style";

export interface IProps {
    children: React.ReactNode;
    /**
     * Pass extra classes
     */
    className?: string;
}

type CustomStyle =
    | "classic"
    | "icon"
    | "line"
    | "sidebar"
    | "aside"
    | "social"
    | "with-icon";

interface INav extends IProps, FlexboxProps, SpaceProps, TypographyProps {
    pills?: boolean;
    align?: "left" | "right" | "center";
    vertical?: boolean;
    fill?: boolean;
    customStyle?: CustomStyle;
}

const Nav = ({
    children,
    className,
    pills,
    align,
    vertical,
    fill,
    customStyle,
    ...rest
}: INav) => {
    const RenderChild = Children.map(children, (child) => {
        if (!isValidElement(child)) {
            return child;
        }

        const Child = child.type;
        return <Child {...child.props} />;
    });

    return (
        <StyledNav
            className={classnames(className, "nav")}
            $pills={pills}
            $align={align}
            $vertical={vertical}
            $fill={fill}
            $customStyle={customStyle}
            {...rest}
        >
            {RenderChild}
        </StyledNav>
    );
};

export default Nav;
