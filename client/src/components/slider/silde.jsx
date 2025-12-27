import React, { Fragment } from 'react'

import { StartSlider } from '../../until/slideshow';

export default function Silde() {
 StartSlider();

  return (
    <Fragment>
       <section class="homepage-banner">
            <section>
                <div class="banner-slide"> 
                    <img  class="slide-img" src="../Images/Bannerbep1.jpg" alt="slide" />
                    <img  class="slide-img" src="../Images/Bannerbep2.jpg" alt="slide"/>
                    <img  class="slide-img" src="../Images/Bannerbep3.jpg" alt="slide"/>
                </div>
            </section>
        </section>
    </Fragment>
  )
}

