import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LOCALE_LANGUAGE } from "@/constant/apiUrl";
import React from "react";

interface TestimonialProps {
  name: string;
  course: string;
  feedback: string;
  avatarSrc: string;
}

const ENtestimonials: TestimonialProps[] = [
  {
    name: "Ahmed Al-Mansoori",
    course: "Project Management Course",
    feedback:
      "The Project Management course at London Crown Institute of Training was an exceptional experience. The trainers are highly professional, and the content is rich with practical insights. I now feel more confident in managing projects effectively.",
    avatarSrc: "https://github.com/shadcn.png1",
  },
  {
    name: "Fatima Al-Sayed",
    course: "Leadership Training Course",
    feedback:
      "This leadership training course transformed my approach to team management. The interactive sessions and real-life case studies helped me develop strong leadership skills. I highly recommend this course!",
    avatarSrc: "https://github.com/shadcn.png1",
  },
  {
    name: "Khalid Al-Farsi",
    course: "Business Communication Course",
    feedback:
      "The Business Communication course improved my ability to communicate effectively in a corporate environment. The practical exercises and expert guidance made a significant difference in my professional interactions.",
    avatarSrc: "https://github.com/shadcn.png1",
  },
  {
    name: "Layla Hassan",
    course: "Human Resource Management Course",
    feedback:
      "The HR Management course provided in-depth knowledge about modern HR practices. I now have a better understanding of recruitment, employee relations, and performance management. An excellent program!",
    avatarSrc: "https://github.com/shadcn.png1",
  },
  {
    name: "Omar Al-Dabbagh",
    course: "Digital Marketing Course",
    feedback:
      "I gained valuable digital marketing skills that I immediately applied to my business. The course covered SEO, social media strategies, and content marketing in great detail. Truly a game-changer!",
    avatarSrc: "https://github.com/shadcn.png1",
  },
  {
    name: "Huda Al-Najjar",
    course: "Financial Management Course",
    feedback:
      "The Financial Management course helped me enhance my financial planning and analysis skills. The instructors explained complex financial concepts in a simple and practical way. A must-attend course!",
    avatarSrc: "https://github.com/shadcn.png1",
  },
];
const ARtestimonials: TestimonialProps[] = [
  {
    name: "أحمد المنصوري",
    course: "دورة إدارة المشاريع",
    feedback:
      "كانت دورة إدارة المشاريع في معهد كراون لندن تجربة استثنائية. المدربون محترفون للغاية والمحتوى غني برؤى عملية. أصبح لدي الآن ثقة أكبر في إدارة المشاريع بفعالية.",
    avatarSrc: "https://github.com/shadcn.png1",
  },
  {
    name: "فاطمة السيد",
    course: "دورة تدريب القيادة",
    feedback:
      "لقد حولت دورة تدريب القيادة هذه نهجي في إدارة الفريق. ساعدتني الجلسات التفاعلية ودراسات الحالة الواقعية على تطوير مهارات القيادة بشكل كبير. أوصي بهذه الدورة بشدة!",
    avatarSrc: "https://github.com/shadcn.png1",
  },
  {
    name: "خالد الفارسي",
    course: "دورة التواصل في الأعمال",
    feedback:
      "لقد حسنت دورة التواصل في الأعمال قدرتي على التواصل بفعالية في بيئة العمل. كانت التمارين العملية والإرشادات المتخصصة فرقًا كبيرًا في تفاعلاتي المهنية.",
    avatarSrc: "https://github.com/shadcn.png1",
  },
  {
    name: "ليلى حسن",
    course: "دورة إدارة الموارد البشرية",
    feedback:
      "قدمت دورة إدارة الموارد البشرية معرفة عميقة حول ممارسات الموارد البشرية الحديثة. أصبح لدي الآن فهم أفضل للتوظيف، والعلاقات مع الموظفين، وإدارة الأداء. برنامج ممتاز!",
    avatarSrc: "https://github.com/shadcn.png1",
  },
  {
    name: "عمر الدباغ",
    course: "دورة التسويق الرقمي",
    feedback:
      "اكتسبت مهارات تسويق رقمي قيمة طبقتها فورًا في عملي. غطت الدورة استراتيجيات تحسين محركات البحث، وسائل التواصل الاجتماعي، والتسويق بالمحتوى بشكل مفصل. كانت حقًا نقطة تحول!",
    avatarSrc: "https://github.com/shadcn.png1",
  },
  {
    name: "هدى النجار",
    course: "دورة إدارة المالية",
    feedback:
      "ساعدتني دورة إدارة المالية على تعزيز مهارات التخطيط المالي والتحليل. شرح المعلمون المفاهيم المالية المعقدة بطريقة بسيطة وعملية. دورة يجب حضورها!",
    avatarSrc: "https://github.com/shadcn.png1",
  },
];





const testimonials = LOCALE_LANGUAGE === "en" ? ENtestimonials : ARtestimonials;
const Testimonials: React.FC = () => {
  return (
    <div>
      <section className="relative">
        <div className="mx-auto max-w-7xl px-5">
          {/* Testimonial Wall */}
          <div className="mb-8 gap-5 py-4 [column-count:1] md:mb-12 md:[column-count:2] lg:mb-16 lg:[column-count:3]">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                  className="mb-6 gap-6 overflow-hidden rounded-2xl border border-solid border-gray-300 bg-white p-8 h-[16rem]"
              >
                <div className="mb-4 flex flex-row items-center">
                  <Avatar className="text-sm text-primary mr-2">
                    <AvatarImage src={testimonial.avatarSrc} />
                    <AvatarFallback className="text-primary">
                      {testimonial.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <h3 className="text-base font-semibold -mt-4">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {testimonial.course}
                    </p>
                  </div>
                </div>
                <p className="mb-4 text-sm text-gray-500">
                  {testimonial.feedback}
                </p>
                <div className="flex">
                  {[...Array(5)].map((_, idx) => (
                    <img
                      key={idx}
                      src="https://assets.website-files.com/63904f663019b0d8edf8d57c/63904f663019b0ce62f8d5ba_Vector.svg"
                      alt=""
                      className="mr-1.5 inline-block w-4 flex-none"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;
