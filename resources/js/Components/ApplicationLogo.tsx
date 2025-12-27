import { SVGAttributes } from 'react';

export default function ApplicationLogo(props: React.ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            {...props}
            src="/img/LogoSekolah.webp"
            alt="Logo SMPN 2 Merapi Barat"
        />
    );
}
