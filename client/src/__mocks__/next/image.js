// __mocks__/components/ImageGenerator.js
export default function ImageGenerator({ onImageGenerated }) {
  return (
    <button onClick={() => onImageGenerated('http://localhost:5000/public/generated-image.png')}>
      Mock Generate Image
    </button>
  );
}
