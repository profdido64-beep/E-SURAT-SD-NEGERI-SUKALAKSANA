import React from 'react';
import { SchoolProfile } from '../types';

// Use local static files instead of external Drive links to guarantee load reliability without CORS issues
const defaultLogoKiriUrl = "/logo-cianjur.png";
const defaultLogoKananUrl = "/logo-sdn-sukalaksana.png";

export const LogoKabupatenCianjur: React.FC<{
  className?: string;
  size?: number;
  customUrl?: string;
}> = ({ className = '', size = 76, customUrl }) => {
  return (
    <img
      src={customUrl || defaultLogoKiriUrl}
      alt="Logo Kabupaten Cianjur"
      width={size}
      className={`object-contain inline-block shrink-0 ${className}`}
      crossOrigin={customUrl ? "anonymous" : undefined}
    />
  );
};

export const LogoSdnSukalaksana: React.FC<{
  className?: string;
  size?: number;
  customUrl?: string;
}> = ({ className = '', size = 76, customUrl }) => {
  return (
    <img
      src={customUrl || defaultLogoKananUrl}
      alt="Logo SD Negeri Sukalaksana"
      width={size}
      className={`object-contain inline-block shrink-0 ${className}`}
      crossOrigin={customUrl ? "anonymous" : undefined}
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
          <div style={{ fontSize: size === 'sm' ? '12px' : '16px', whiteSpace: 'nowrap' }}>DINAS PENDIDIKAN PEMUDA DAN OLAHRAGA</div>
          <div style={{ fontSize: size === 'sm' ? '12px' : '16px', whiteSpace: 'nowrap' }}>KABUPATEN CIANJUR</div>
          <div style={{ fontSize: size === 'sm' ? '18px' : '22px', fontWeight: 'bold', margin: '4px 0', whiteSpace: 'nowrap' }}>{schoolName}</div>
          <div style={{ fontSize: size === 'sm' ? '12px' : '16px', whiteSpace: 'nowrap' }}>{subdistrictOffice}</div>
          <div style={{ fontSize: size === 'sm' ? '11px' : '12px', fontStyle: 'italic', marginTop: '4px' }}>{addressLine}</div>
        </div>

        {/* Logo Kanan: Logo Sekolah */}
        <div style={{ flexShrink: 0 }}>
          <LogoSdnSukalaksana size={logoSize} customUrl={profile?.logoSchoolUrl || profile?.logoUrl} />
        </div>
        
      </div>
    </div>
  );
};
