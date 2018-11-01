import React from 'react';
import styled, { keyframes } from 'styled-components';
import { colors } from './constants';

const LOADING_COLOR = colors.mainTheme
const LOADING_SIZE = 15
const LOADING_DURATION = 1.3

const loading = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

function getColor(props) {
  const d = document.createElement('div');
  d.style.color = LOADING_COLOR;
  document.body.appendChild(d);
  const rgbcolor = window.getComputedStyle(d).color;
  const match = /rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*\d+[.d+]*)*\)/g.exec(rgbcolor);
  const color = `${match[1]}, ${match[2]}, ${match[3]}`;
  return color;
}

const RotateSpin = styled.div`
  animation: ${loading} ${LOADING_DURATION}s infinite linear;
  border: 1.1em solid rgba(${getColor(LOADING_COLOR)}, 0.2);
  border-left: 1.1em solid ${LOADING_COLOR};
  border-radius: 50%;
  font-size: ${LOADING_SIZE}px;
  height: 10em;
  margin: 60px auto;
  position: relative;
  text-indent: -9999em;
  transform: translateZ(0);
  width: 10em;
  &:after {
    border-radius: 50%;
    height: 10em;
    width: 10em;
  }
`;

const Loading = () => {
  return (
    <div style={{width: '100%', textAlign: 'center'}}>
      <RotateSpin />
    </div>
  );
}

export default Loading;

/*

See here: https://github.com/LucasBassetti/react-css-loaders/blob/master/lib/rotate-spin/RotateSpin.jsx

The MIT License (MIT)

Copyright (c) 2017 Lucas Bassetti

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/