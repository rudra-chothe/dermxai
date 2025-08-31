import type { AnchorHTMLAttributes, ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { cx, sortCx } from "@/utils/cx";
import { AppleLogo, DribbleLogo, FacebookLogo, FigmaLogo, FigmaLogoOutlined, GoogleLogo, TwitterLogo } from "./social-logos";

export const styles = sortCx({
    common: {
        root: "group relative inline-flex h-max cursor-pointer items-center justify-center font-semibold whitespace-nowrap outline-focus-ring transition duration-100 ease-linear before:absolute focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:stroke-fg-disabled disabled:text-fg-disabled disabled:*:text-fg-disabled",
        icon: "pointer-events-none shrink-0 transition-inherit-all",
    },

    sizes: {
        sm: {
            root: "gap-2 rounded-lg px-3 py-2 text-sm before:rounded-[7px] data-icon-only:p-2",
        },
        md: {
            root: "gap-2.5 rounded-lg px-3.5 py-2.5 text-sm before:rounded-[7px] data-icon-only:p-2.5",
        },
        lg: {
            root: "gap-3 rounded-lg px-4 py-2.5 text-md before:rounded-[7px] data-icon-only:p-2.5",
        },
        xl: {
            root: "gap-3.5 rounded-lg px-4.5 py-3 text-md before:rounded-[7px] data-icon-only:p-3.5",
        },
        "2xl": {
            root: "gap-4 rounded-[10px] px-5.5 py-4 text-lg before:rounded-[9px] data-icon-only:p-4",
        },
    },

    colors: {
        gray: {
            root: "bg-primary text-secondary shadow-xs-skeumorphic ring-1 ring-primary ring-inset hover:bg-primary_hover hover:text-secondary_hover",
            icon: "text-fg-quaternary group-hover:text-fg-quaternary_hover",
        },
        black: {
            root: "bg-black text-white shadow-xs-skeumorphic ring-1 ring-transparent ring-inset before:absolute before:inset-px before:border before:border-white/12 before:mask-b-from-0%",
            icon: "",
        },

        facebook: {
            root: "bg-[#1877F2] text-white shadow-xs-skeumorphic ring-1 ring-transparent ring-inset before:absolute before:inset-px before:border before:border-white/12 before:mask-b-from-0% hover:bg-[#0C63D4]",
            icon: "",
        },

        dribble: {
            root: "bg-[#EA4C89] text-white shadow-xs-skeumorphic ring-1 ring-transparent ring-inset before:absolute before:inset-px before:border before:border-white/12 before:mask-b-from-0% hover:bg-[#E62872]",
            icon: "",
        },
    },
});

interface CommonProps {
    social: "google" | "facebook" | "apple" | "twitter" | "figma" | "dribble";
    disabled?: boolean;
    theme?: "brand" | "color" | "gray";
    size?: keyof typeof styles.sizes;
}

interface ButtonProps extends CommonProps, DetailedHTMLProps<Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color">, HTMLButtonElement> {}

interface LinkProps extends CommonProps, DetailedHTMLProps<Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "color">, HTMLAnchorElement> {}

export type SocialButtonProps = ButtonProps | LinkProps;

export const SocialButton = ({ size = "lg", theme = "color", social, className, children, disabled, ...otherProps }: SocialButtonProps) => {
    const href = "href" in otherProps ? otherProps.href : undefined;
    const Component = href ? "a" : "button";

    const isIconOnly = !children;

    // Custom styles to match the image exactly
    const buttonStyles = "w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors";

    const logos = {
        google: GoogleLogo,
        facebook: FacebookLogo,
        apple: AppleLogo,
        twitter: TwitterLogo,
        figma: theme === "gray" ? FigmaLogoOutlined : FigmaLogo,
        dribble: DribbleLogo,
    };

    const Logo = logos[social];

    let props = {};

    if (href) {
        props = {
            ...otherProps,
            href: disabled ? undefined : href,
            ...(disabled ? { "data-disabled": true } : {}),
        };
    } else {
        props = {
            ...otherProps,
            type: otherProps.type || "button",
            disabled: disabled,
        };
    }

    return (
        <Component
            {...props}
            data-icon-only={isIconOnly ? true : undefined}
            className={cx(buttonStyles, className)}
        >
            <Logo
                className="h-5 w-5 mr-2"
                colorful={true}
            />

            {children}
        </Component>
    );
};
