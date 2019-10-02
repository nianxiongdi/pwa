/**
 * @file render.js
 * @author huanghuiquan
 */

define(function (require) {
    'use strict';

    return function (data) {
        let html = data.subjects.map(function (subject) {
            return `
            <li>
                <picture>
                    <source srcset="${subject.images.medium}" type="image/webp">
                    <img src="${subject.images.medium}"/>
                    <p>${subject.title}</p>
                </picture>

            </li>
            `;
        }).join('');
        return html;
    };
});
