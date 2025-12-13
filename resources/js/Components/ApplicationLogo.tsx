import { SVGAttributes } from 'react';

export default function ApplicationLogo(props: React.ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            {...props}
            src="/img/LogoSekolah.png"
            alt="Logo SMPN 2 Merapi Barat"
        />
    );
}
