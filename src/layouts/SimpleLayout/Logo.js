import React from 'react';
import styled from 'styled-components';

const Logo = ({ size }) => {
    return size == 'xs'
        ? <Xs src="/static/logos/genesis_logo_blue.svg"></Xs>
        : <Medium src="/static/logos/genesis_logo_blue_full.svg"></Medium>
}

export default Logo


const Medium = styled.img`
    height: 2.4em;
`

const Xs = styled.img`
    height: 2.4em;
    /* width: 2.4em; */
`