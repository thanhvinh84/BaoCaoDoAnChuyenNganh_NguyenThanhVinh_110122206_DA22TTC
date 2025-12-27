import React from 'react'

export default function About() {
  return (
    <div id="coolmate-story">
      <section className="cs-banner">
        <div className="cs-banner__image">
          <img src="../Images/Bannerabout.jpg" alt="Banner Bếp Điện Tử" />
        </div>
        <div className="cs-banner__content">
          <h1 className="cs-banner__heading">Câu chuyện về Bếp Điện Tử</h1>
          <p className="cs-banner__description">Khám phá hành trình và sứ mệnh của ngành bếp điện tử trong việc mang đến giải pháp nấu ăn hiện đại, an toàn và tiết kiệm năng lượng cho mọi gia đình Việt.</p>
        </div>
      </section>

      <section className="cs-about">
        <div className="container-medium">
          <div className="grid">
            <div className="grid__column four-twelfths">
              <div className="cs-about__content">
                <h2 className="cs-about__heading" style={{whiteSpace: 'nowrap'}}>
                  Bếp điện tử 
                </h2>
              </div>
              <div className="cs-about__image">
                <img src="../Images/Bepdientu1.jpg" alt="Bếp điện tử hiện đại" />
              </div>
            </div>
            <div className="grid__column eight-twelfths">
              <div className="cs-about__description">
                <p>Bếp điện tử ra đời nhằm giúp việc nấu ăn trở nên nhanh chóng, an toàn và tiết kiệm hơn. Từ những thiết bị đơn giản, công nghệ bếp điện tử đã phát triển mạnh mẽ, tích hợp nhiều tính năng thông minh, phù hợp với mọi không gian bếp hiện đại.</p>
                <p>Ngày nay, bếp điện tử không chỉ là thiết bị nhà bếp mà còn là điểm nhấn thẩm mỹ, thể hiện phong cách sống tinh tế và sự quan tâm tới sức khỏe gia đình. Các thương hiệu bếp không ngừng sáng tạo, cải tiến công nghệ để đáp ứng nhu cầu ngày càng cao của người tiêu dùng.</p>
                <p>Ngành bếp điện tử cũng đang hướng đến các sản phẩm tiết kiệm điện năng, thân thiện môi trường và an toàn tuyệt đối cho người sử dụng.</p>
                <p><a href="#" style={{ textDecoration: 'underline' }}>Tìm hiểu thêm về công nghệ bếp điện tử</a></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cs-caption">
        <div className="container-medium">
          <h2 className="cs-caption__heading">
            <span>“</span>
            Bếp điện tử không chỉ là công cụ nấu nướng, mà còn là người bạn đồng hành giúp mỗi bữa ăn trở thành trải nghiệm đầy cảm hứng.
            <br />
            Tiết kiệm, an toàn và đầy sáng tạo trong từng món ăn.
            <span>“</span>
          </h2>
          <span className="cs-caption__author">Một người yêu bếp</span>
        </div>
      </section>

      <section className="cs-story">
        <div className="container-medium">
          <div className="grid grid--mobile-rev">
            <div className="grid__column five-twelfths">
              <div className="cs-story__image">
                <img src="../Images/serviec.jpg" alt="Đội ngũ tư vấn khách hàng" />
                <span className="cs-services__alt">Đội ngũ tư vấn khách hàng</span>
              </div>
            </div>
            <div className="grid__column seven-twelfths">
              <div className="cs-story__content">
                <div className="cs-story__heading">
                  Dịch vụ khách hàng trong ngành bếp điện tử
                </div>
                <div className="ca-story__description">
                  <p>Khách hàng ngày càng chú trọng trải nghiệm dịch vụ sau bán hàng. Các thương hiệu bếp điện tử tập trung mạnh vào chính sách bảo hành, tư vấn sử dụng, lắp đặt tận nơi và hỗ trợ kỹ thuật chuyên nghiệp.</p>
                  <p>Không chỉ là sản phẩm chất lượng, nhiều thương hiệu còn tổ chức các buổi hướng dẫn nấu ăn, chia sẻ công thức món ngon và xây dựng cộng đồng những người yêu bếp.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cs-services">
        <div className="container-medium">
          <h2 className="cs-services__heading">
            Hướng tới mô hình doanh nghiệp bếp điện tử có trách nhiệm
          </h2>

          <div id="services1" className="grid grid--aligned-center">
            <div className="grid__column">
              <h3 className="cs-services__title">#1. Với khách hàng</h3>
              <div className="cs-services__description">
                <p>Chúng tôi cam kết mang đến những sản phẩm bếp điện tử chất lượng, an toàn và tiết kiệm điện. Hệ thống phân phối chính hãng, dịch vụ hậu mãi tận tâm và tư vấn chi tiết luôn là ưu tiên hàng đầu.</p>
              </div>
            </div>
            <div className="grid__column">
              <div className="cs-services__image">
                <img src="../Images/Bepdientu2.jpg" alt="Ảnh showroom bếp điện tử" />
                <span className="cs-services__alt">Ảnh showroom bếp điện tử</span>
              </div>
            </div>
          </div>

          <div id="services2" className="grid grid--aligned-center">
            <div className="grid__column">
              <h3 className="cs-services__title">#2. Với nhân viên</h3>
              <div className="cs-services__description">
                <p>Chúng tôi xây dựng môi trường làm việc chuyên nghiệp, năng động, tạo điều kiện để đội ngũ tư vấn và kỹ thuật phát triển sự nghiệp cũng như đam mê với ngành bếp điện tử.</p>
              </div>
            </div>
            <div className="grid__column">
              <div className="cs-services__image">
                <img src="../Images/coolmate010.png" alt="Ảnh đội ngũ nhân viên tại sự kiện bếp" />
                <span className="cs-services__alt">Ảnh đội ngũ nhân viên tại sự kiện bếp</span>
              </div>
            </div>
          </div>

          <div id="services3" className="grid grid--aligned-center">
            <div className="grid__column">
              <h3 className="cs-services__title">#3. Với đối tác</h3>
              <div className="cs-services__description">
                <p>Chúng tôi hợp tác chặt chẽ cùng các nhà sản xuất linh kiện, đơn vị cung cấp phụ kiện bếp và các đối tác phân phối nhằm mang đến giải pháp toàn diện và sản phẩm chất lượng nhất tới người tiêu dùng.</p>
              </div>
            </div>
            <div className="grid__column">
              <div className="cs-services__image">
                <img src="../Images/sanxuatbep.jpg" alt="Ảnh tại xưởng sản xuất bếp điện tử" />
                <span className="cs-services__alt">Ảnh tại xưởng sản xuất bếp điện tử</span>
              </div>
            </div>
          </div>

          <div id="services4" className="grid grid--aligned-center">
            <div className="grid__column">
              <h3 className="cs-services__title">#4. Với môi trường</h3>
              <div className="cs-services__description">
                <p>Ngành bếp điện tử đang phát triển các sản phẩm tiết kiệm điện năng, ít phát thải và thân thiện với môi trường, góp phần xây dựng lối sống xanh, bền vững cho cộng đồng.</p>
              </div>
            </div>
            <div className="grid__column">
              <div className="cs-services__image">
                <img src="../Images/beptietkiemnangluong.jpg" alt="Bếp điện tử tiết kiệm năng lượng" />
                <span className="cs-services__alt">Bếp điện tử tiết kiệm năng lượng</span>
              </div>
            </div>
          </div>

          <div id="services5" className="grid grid--aligned-center">
            <div className="grid__column">
              <h3 className="cs-services__title">#5. Với cộng đồng</h3>
              <div className="cs-services__description">
                <p>Chúng tôi mong muốn lan tỏa niềm đam mê nấu nướng, tổ chức các hoạt động từ thiện, chia sẻ kiến thức nấu ăn và hỗ trợ những hoàn cảnh khó khăn thông qua cộng đồng yêu bếp.</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
