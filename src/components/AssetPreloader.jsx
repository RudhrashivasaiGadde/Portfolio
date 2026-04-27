import { useTexture, Image } from '@react-three/drei';

const socialLogos = [
  'https://cdn-icons-png.flaticon.com/512/174/174857.png',
  'https://cdn-icons-png.flaticon.com/512/733/733579.png',
  'https://cdn-icons-png.flaticon.com/512/1384/1384060.png',
  'https://cdn-icons-png.flaticon.com/512/2111/2111463.png'
];

export function AssetPreloader({ active }) {
  if (!active) return null;

  return (
    <group visible={false}>
      {socialLogos.map((url) => (
        <Image key={url} url={url} position={[0, -100, 0]} />
      ))}
    </group>
  );
}
