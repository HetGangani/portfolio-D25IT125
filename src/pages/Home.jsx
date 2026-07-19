import Header from "../components/Header";
import About from "../components/About";
import Skills from "../components/Skills";
import Footer from "../components/Footer";

function Home() {
    
    const skills = ["HTML", "CSS", "JAVA", "C++", "Cyber Security", "Cloud Computing"];

    return (
        <div className="page">
            <Header name="Het Gangani"></Header>
            <About></About>
            <Skills skillList={skills}></Skills>
            <Footer email="hetgangani08@gmail.com"></Footer>
        </div>
    );
}

export default Home;