import React from 'react'
import '../App.css';
import { MDBCard, MDBListGroup, MDBListGroupItem, MDBCollapse, MDBBtn, MDBCol, MDBContainer, MDBSideNavLink, MDBSideNavCat, MDBRow, MDBSideNav, MDBIcon, MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavLink, MDBSideNavNav } from "mdbreact"
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { Songs } from '../songs';
import { connect } from 'react-redux';
import { setSentences } from '../store/sentences/action';

class ContentPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openNav: false,
            desktop: false,
            isOpen: false,
            collapseID: ''
        }
    }

    toggleCollapse = collapseID => () => {
        this.setState(prevState => ({
            collapseID: prevState.collapseID !== collapseID ? collapseID : ""
        }));
    }
    SideBar = () => {
        this.setState({ openNav: !this.state.openNav })
    }
    componentDidMount() {
        window.addEventListener('resize', this.UpdateDesktop)
    }
    componentWillMount() {
        window.addEventListener('resize', this.UpdateDesktop)
    }
    UpdateDesktop = () => {
        this.setState({ desktop: !this.state.desktop })
    }

    splitSentences = song => {
        if (song.length === 0) {
            this.setState({ alert: 'Please add some text or paste it' });
            setTimeout(() => this.setState({ alert: '' }), 1000)
            return;
        }
        let sentences = [];
        let signs = ['\n', '?', '.', '!'];
        for (let j = 0; j < song.length; j++) {
            const letter = song[j];
            if (signs.includes(letter)) {
                const index = song.indexOf(letter) + 1;
                const newSentence = song.slice(0, index);
                let removeExtraSigns = newSentence;
                for (let i = index; i < song.length; i++) {
                    if (signs.includes(song[i])) {
                        removeExtraSigns += song[i]
                    } else {
                        break;
                    }
                }
                j = 0;
                song = song.replace(removeExtraSigns, '');
                if (newSentence.trim()) {
                    sentences.push({ sentence: newSentence.replace(/\s{2,}/g, ' ').trim(), mastered: null, tried: false });
                }
            } else if (j === song.length - 1) {
                const newSentence = song.slice(0, song.length);
                if (newSentence.trim()) {
                    sentences.push({ sentence: newSentence.replace(/\s{2,}/g, ' ').trim(), mastered: null, tried: false });
                }
            }
        }
        this.props.setSentences(sentences);
        this.props.history.push("editCode");
    }
    render() {

        return <div>
            {/* navbar */}
            <MDBNavbar dark expand="md" fixed="top" >
                <MDBNavbarBrand>
                    <Link to="/"><img src={require('../assets/icons/logo.jpg')} style={{width: '40%'}}/></Link>
                </MDBNavbarBrand>
                <MDBNavbarNav right>
                    {window.innerWidth > 800 ? <>
                        <MDBNavLink to="/about" >About</MDBNavLink>
                        <MDBNavLink className="active_links" to="/content" >Content</MDBNavLink>
                        <MDBNavLink to="/" color="success" style={{ border: '2px solid #00c851', background: 'transparent', color: '#00c851', margin: '0px 8px', borderRadius: 3, padding: '8px 15px' }} onClick={() => this.props.history.push('/')} >Learn</MDBNavLink>
                    </> : <MDBBtn outline={true} color="black" id="hamburgher" onClick={() => this.SideBar()}>
                            <MDBIcon size="md" icon="bars" />
                        </MDBBtn>}
                </MDBNavbarNav>
            </MDBNavbar>
            {/* side navbar */}
            {this.state.openNav ?
                <MDBContainer>
                    <MDBSideNav
                        fixed={true}
                        slim={true}
                        hidden
                        triggerOpening={this.state.openNav}
                        breakWidth={1500}
                    >
                        <li style={{
                            padding: '30px 20px',
                            textAlign: 'center',
                            margin: '0 auto',
                        }}>
                            <Link to="/" onClick={this.SideBar}> DO NOT BLINK </Link>
                            <MDBNavLink to="/" color="success" style={{ border: '2px solid #00c851', background: 'transparent', color: '#00c851', margin: '0px 8px', borderRadius: 3, padding: '8px 15px' }} onClick={() => {
                                this.SideBar()
                                this.props.history.push('/')
                            }} >Learn It!</MDBNavLink>

                        </li>
                        <li >
                            <MDBNavLink to="/about" onClick={this.SideBar}>
                                About
                    </MDBNavLink>
                        </li>
                        <li className="active_links">
                            <MDBNavLink to="/content" onClick={this.SideBar}>
                                Content
                    </MDBNavLink>
                        </li>
                    </MDBSideNav>
                </MDBContainer>
                : null}

            <MDBContainer style={{ height: window.innerHeight, marginTop: '20%' }}>
                <MDBRow>
                    <MDBCol size={2} md={4} lg={4}>
                        <h1>Content</h1>
                    </MDBCol>
                    <MDBCol sm={12} md={8} lg={8} >
                        <MDBContainer>
                            <MDBListGroup style={{ width: '100%', cursor: 'pointer', fontSize: '1em' }}>
                                {Songs.map(song => <> <MDBListGroupItem style={styles.accordionContainer} key={song.id} onClick={this.toggleCollapse(song.id)} >
                                    {song.title}
                                    <h6 style={styles.learnIt} onClick={() => this.splitSentences(song.song)}>Learn it!</h6>
                                </MDBListGroupItem>
                                    <MDBCard >
                                        <MDBContainer >
                                            <MDBCollapse isOpen={this.state.collapseID} id={song.id} >
                                                {song.song.split('\n').map(data => <p style={{textAlign: 'center'}}>{data}<br /> </p>)}
                                            </MDBCollapse>
                                        </MDBContainer>
                                    </MDBCard>
                                </>)}
                            </MDBListGroup>
                        </MDBContainer>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>

        </div>
    }
}

const styles = {
    accordionContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    learnIt: {
        color: '#1db71d',
        fontWeight: '500',
        marginBottom: '0px',
    }
}

const mapDispatchToProps = { setSentences }
export default connect(null, mapDispatchToProps)(ContentPage);

