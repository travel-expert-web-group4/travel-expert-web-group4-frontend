import NotFoundImage from "../assets/images/404.png";


export default function NotFound() {
    return (
      <div style={{ display:"flex",justifyContent:"center",flexDirection:"column",alignItems:"center" }}>
        <img src={NotFoundImage} style={{width:800,height:500,marginTop:100}}></img>
        <h1>404 - Page Not Found</h1>
        <p>Sorry, the page you're looking for doesn't exist.</p>
      </div>
    );
  }