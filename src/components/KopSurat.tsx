import React from 'react';
import { SchoolProfile } from '../types';

// Using proxy to avoid CORS issues when generating PDF
const logoKiriUrl = "https://api.allorigins.win/raw?url=" + encodeURIComponent("https://drive.google.com/uc?export=view&id=1uJ4ACirNnGY7NIErAZY7qwNSekC0AuQm");
const logoKananUrl = "https://api.allorigins.win/raw?url=" + encodeURIComponent("https://drive.google.com/uc?export=view&id=1-5wkGy5GmreMK0jgcuL81cy5AZbBw7gi");

export const LogoKabupatenCianjur: React.FC<{
  className?: string;
  size?: number;
  customUrl?: string;
}> = ({ className = '', size = 76, customUrl }) => {
  const [imgSrc, setImgSrc] = React.useState(() => {
    return customUrl ? (customUrl.includes('allorigins') ? customUrl : `https://api.allorigins.win/raw?url=${encodeURIComponent(customUrl)}`) : logoKiriUrl;
  });

  return (
    <img
      src={imgSrc}
      alt="Logo Kabupaten Cianjur"
      width={size}
      className={`object-contain inline-block shrink-0 ${className}`}
      crossOrigin="anonymous"
      onError={() => {
        // Fallback to direct URL if proxy fails
        if (imgSrc.includes('allorigins')) {
          setImgSrc(customUrl || "https://drive.google.com/uc?export=view&id=1uJ4ACirNnGY7NIErAZY7qwNSekC0AuQm");
        }
      }}
    />
  );
};

export const LogoSdnSukalaksana: React.FC<{
  className?: string;
  size?: number;
  customUrl?: string;
}> = ({ className = '', size = 76, customUrl }) => {
  const [imgSrc, setImgSrc] = React.useState(() => {
    return customUrl ? (customUrl.includes('allorigins') ? customUrl : `https://api.allorigins.win/raw?url=${encodeURIComponent(customUrl)}`) : logoKananUrl;
  });

  return (
    <img
      src={imgSrc}
      alt="Logo SD Negeri Sukalaksana"
      width={size}
      className={`object-contain inline-block shrink-0 ${className}`}
      crossOrigin="anonymous"
      onError={() => {
        // Fallback to direct URL if proxy fails
        if (imgSrc.includes('allorigins')) {
          setImgSrc(customUrl || "https://drive.google.com/uc?export=view&id=1-5wkGy5GmreMK0jgcuL81cy5AZbBw7gi");
        }
      }}
    />
  );
};

interface KopSuratProps {
  profile?: SchoolProfile;
  showBorder?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const KopSurat: React.FC<KopSuratProps> = ({
  profile,
  showBorder = true,
  className = '',
  size = 'md',
}) => {
  const logoSize = size === 'sm' ? 62 : size === 'lg' ? 95 : 85;

  const schoolName = profile?.name || 'SD NEGERI SUKALAKSANA';
  const subdistrictOffice = profile?.subdistrictOffice || 'KECAMATAN SUKANAGARA';
  const addressLine =
    profile?.address && profile?.postalCode
      ? `Alamat : ${profile.address} ${profile.postalCode}`
      : 'Alamat : Kp. Sukalaksana Desa Sukalaksana Kec. Sukanagara Kab. Cianjur 43264';

  return (
    <div className={`w-full bg-white select-none ${className}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: showBorder ? '3px double #000000' : 'none', paddingBottom: '10px', marginBottom: '20px', fontFamily: '"Times New Roman", Times, serif', color: '#000000', backgroundColor: '#ffffff' }}>
        
        {/* Logo Kiri: Logo Daerah */}
        <div style={{ flexShrink: 0 }}>
          <LogoKabupatenCianjur size={logoSize} customUrl={profile?.logoCianjurUrl} />
        </div>

        {/* Bagian Tengah: Teks Kop Surat */}
        <div style={{ textAlign: 'center', flexGrow: 1, padding: '0 15px', lineHeight: 1.2 }}>
          <div style={{ fontSize: size === 'sm' ? '12px' : '16px' }}>DINAS PENDIDIKAN PEMUDA DAN OLAHRAGA</div>
          <div style={{ fontSize: size === 'sm' ? '12px' : '16px' }}>KABUPATEN CIANJUR</div>
          <div style={{ fontSize: size === 'sm' ? '18px' : '24px', fontWeight: 'bold', margin: '4px 0' }}>{schoolName}</div>
          <div style={{ fontSize: size === 'sm' ? '12px' : '16px' }}>{subdistrictOffice}</div>
          <div style={{ fontSize: size === 'sm' ? '11px' : '14px', fontStyle: 'italic', marginTop: '4px' }}>{addressLine}</div>
        </div>

        {/* Logo Kanan: Logo Sekolah */}
        <div style={{ flexShrink: 0 }}>
          <LogoSdnSukalaksana size={logoSize} customUrl={profile?.logoSchoolUrl || profile?.logoUrl} />
        </div>
        
      </div>
    </div>
  );
};
