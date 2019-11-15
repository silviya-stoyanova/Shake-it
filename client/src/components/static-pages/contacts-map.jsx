import React, { Component } from 'react'
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';

export class MapContainer extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const style = {
            width: '50%',
            height: '50%',
            left: '45%'
        }
        
        return (
            <Map google={this.props.google} style={style} zoom={14}>

                <Marker onClick={this.onMarkerClick}
                    name={'Current location'} />

                <InfoWindow onClose={this.onInfoWindowClose}>
                    <div>
                        {/* <h1>{this.state.selectedPlace.name}</h1> */}
                    </div>
                </InfoWindow>
            </Map>
        )
    }
}

export default GoogleApiWrapper({
    apiKey: ('AIzaSyD8pzNQ44_YWIv7gGovwQ_Owi1bZ3-pEmM')
})(MapContainer)