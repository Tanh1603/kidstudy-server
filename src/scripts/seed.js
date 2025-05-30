import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../db/schema.js";

dotenv.config({ path: ".env.development" });
const sql = postgres(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Seeding database");

    // Xóa dữ liệu cũ
    await db.execute(`TRUNCATE TABLE "challenges" RESTART IDENTITY CASCADE`);
    await db.execute(`TRUNCATE TABLE "units" RESTART IDENTITY CASCADE`);
    await db.execute(`TRUNCATE TABLE "lessons" RESTART IDENTITY CASCADE`);
    await db.execute(
      `TRUNCATE TABLE "challenge_options" RESTART IDENTITY CASCADE`
    );
    await db.execute(
      `TRUNCATE TABLE "user_subscription" RESTART IDENTITY CASCADE`
    );
    await db.execute(
      `TRUNCATE TABLE "challenge_progress" RESTART IDENTITY CASCADE`
    );

    // Thêm dữ liệu Unit
    const units = await db
      .insert(schema.units)
      .values([
        {
          title: "Beginner English",
          description: "Foundation vocabulary and basic structures",
          order: 1,
        },
        {
          title: "Everyday English",
          description: "Common phrases and practical expressions",
          order: 2,
        },
        {
          title: "Business English",
          description: "Professional vocabulary and formal communication",
          order: 3,
        },
        {
          title: "Travel English",
          description: "Essential vocabulary for traveling and tourism",
          order: 4,
        },
        {
          title: "Academic English",
          description: "Advanced vocabulary for academic purposes",
          order: 5,
        },
      ])
      .returning();

    // Từ điển Anh-Việt với hình ảnh và âm thanh
    const vocabulary = {
      // UNIT 1: BEGINNER ENGLISH
      // Lesson 1: Basic Nouns
      apple: {
        vietnamese: "quả táo",
        image:
          "https://cdn.pixabay.com/photo/2016/08/12/22/34/apple-1589869_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=apple",
      },
      banana: {
        vietnamese: "quả chuối",
        image:
          "https://cdn.pixabay.com/photo/2018/09/24/20/12/bananas-3700718_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=banana",
      },
      orange: {
        vietnamese: "quả cam",
        image:
          "https://cdn.pixabay.com/photo/2016/01/02/02/03/orange-1117645_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=orange",
      },
      car: {
        vietnamese: "xe hơi",
        image:
          "https://cdn.pixabay.com/photo/2019/07/07/14/03/fiat-4322521_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=car",
      },
      bicycle: {
        vietnamese: "xe đạp",
        image:
          "https://cdn.pixabay.com/photo/2016/11/18/12/49/bicycle-1834265_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=bicycle",
      },

      // Lesson 2: Colors & Numbers
      red: {
        vietnamese: "màu đỏ",
        image:
          "https://cdn.pixabay.com/photo/2017/09/08/20/29/red-2730334_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=red",
      },
      blue: {
        vietnamese: "màu xanh dương",
        image:
          "https://cdn.pixabay.com/photo/2017/01/17/11/06/water-1986312_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=blue",
      },
      green: {
        vietnamese: "màu xanh lá",
        image:
          "https://cdn.pixabay.com/photo/2015/06/19/21/24/avenue-815297_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=green",
      },
      yellow: {
        vietnamese: "màu vàng",
        image:
          "https://cdn.pixabay.com/photo/2015/10/01/14/07/sunflower-967339_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=yellow",
      },
      purple: {
        vietnamese: "màu tím",
        image:
          "https://cdn.pixabay.com/photo/2016/01/08/11/57/butterfly-weed-1127802_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=purple",
      },

      // Lesson 3: Simple Verbs
      eat: {
        vietnamese: "ăn",
        image:
          "https://cdn.pixabay.com/photo/2015/01/16/15/02/eat-601576_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=eat",
      },
      drink: {
        vietnamese: "uống",
        image:
          "https://cdn.pixabay.com/photo/2017/09/27/18/15/man-2793007_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=drink",
      },
      run: {
        vietnamese: "chạy",
        image:
          "https://cdn.pixabay.com/photo/2016/11/18/13/48/active-1834762_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=run",
      },
      walk: {
        vietnamese: "đi bộ",
        image:
          "https://cdn.pixabay.com/photo/2017/05/17/15/16/walk-2321009_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=walk",
      },
      sleep: {
        vietnamese: "ngủ",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/06/08/beautiful-1867768_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=sleep",
      },

      // Lesson 4: Family Members
      mother: {
        vietnamese: "mẹ",
        image:
          "https://cdn.pixabay.com/photo/2018/05/30/00/24/mother-3440755_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=mother",
      },
      father: {
        vietnamese: "cha",
        image:
          "https://cdn.pixabay.com/photo/2017/06/11/14/40/father-2392463_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=father",
      },
      sister: {
        vietnamese: "chị/em gái",
        image:
          "https://cdn.pixabay.com/photo/2018/02/16/14/38/portrait-3157821_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=sister",
      },
      brother: {
        vietnamese: "anh/em trai",
        image:
          "https://cdn.pixabay.com/photo/2017/09/21/19/12/school-2773345_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=brother",
      },
      grandmother: {
        vietnamese: "bà",
        image:
          "https://cdn.pixabay.com/photo/2018/03/30/09/14/grandmother-3274617_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=grandmother",
      },

      // UNIT 2: EVERYDAY ENGLISH
      // Lesson 1: Greetings & Introductions
      hello: {
        vietnamese: "xin chào",
        image:
          "https://cdn.pixabay.com/photo/2018/09/12/12/09/man-3672010_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=hello",
      },
      goodbye: {
        vietnamese: "tạm biệt",
        image:
          "https://cdn.pixabay.com/photo/2020/03/12/13/33/goodbye-4925102_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=goodbye",
      },
      "good morning": {
        vietnamese: "chào buổi sáng",
        image:
          "https://cdn.pixabay.com/photo/2016/11/23/15/14/sunrise-1853530_960_720.jpg",
        audio:
          "https://audio.dict.cc/speak.audio.php?lang=en&text=good+morning",
      },
      "good night": {
        vietnamese: "chúc ngủ ngon",
        image:
          "https://cdn.pixabay.com/photo/2017/07/22/22/56/moon-2530060_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=good+night",
      },
      "how are you": {
        vietnamese: "bạn khỏe không?",
        image:
          "https://cdn.pixabay.com/photo/2020/11/08/12/39/question-5723375_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=how+are+you",
      },

      // Lesson 2 - 5: các từ vựng khác của UNIT 2
      // [Thêm các từ vựng khác tương tự]

      // UNIT 3: BUSINESS ENGLISH
      // Lesson 1: Office Vocabulary
      meeting: {
        vietnamese: "cuộc họp",
        image:
          "https://cdn.pixabay.com/photo/2018/03/10/12/00/paper-3213924_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=meeting",
      },
      email: {
        vietnamese: "thư điện tử",
        image:
          "https://cdn.pixabay.com/photo/2017/11/12/22/50/email-2944063_960_720.png",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=email",
      },
      interview: {
        vietnamese: "phỏng vấn",
        image:
          "https://cdn.pixabay.com/photo/2019/01/30/21/37/interview-3966221_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=interview",
      },
      manager: {
        vietnamese: "quản lý",
        image:
          "https://cdn.pixabay.com/photo/2019/08/15/09/27/manager-4407650_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=manager",
      },
      deadline: {
        vietnamese: "hạn chót",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/08/41/calendar-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=deadline",
      },

      // Lesson 2 - 5: các từ vựng khác của UNIT 3
      // [Thêm các từ vựng khác tương tự]

      // Thêm từ vựng thiếu - Basic Adjectives
      big: {
        vietnamese: "to lớn",
        image:
          "https://cdn.pixabay.com/photo/2017/06/02/18/24/elephant-2367414_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=big",
      },
      small: {
        vietnamese: "nhỏ",
        image:
          "https://cdn.pixabay.com/photo/2018/01/06/23/25/snow-3066167_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=small",
      },
      hot: {
        vietnamese: "nóng",
        image:
          "https://cdn.pixabay.com/photo/2018/03/07/18/42/fire-3206631_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=hot",
      },
      cold: {
        vietnamese: "lạnh",
        image:
          "https://cdn.pixabay.com/photo/2017/01/19/07/46/snow-1991890_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=cold",
      },
      happy: {
        vietnamese: "vui vẻ",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/13/14/attractive-1869761_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=happy",
      },

      // UNIT 4: TRAVEL ENGLISH
      // Lesson 1: Transportation
      airport: {
        vietnamese: "sân bay",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/adult-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=airport",
      },
      train: {
        vietnamese: "tàu hỏa",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/train-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=train",
      },
      bus: {
        vietnamese: "xe buýt",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/bus-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=bus",
      },
      taxi: {
        vietnamese: "taxi",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/taxi-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=taxi",
      },
      subway: {
        vietnamese: "tàu điện ngầm",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/subway-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=subway",
      },

      // Lesson 2: Accommodation
      hotel: {
        vietnamese: "khách sạn",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/hotel-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=hotel",
      },
      hostel: {
        vietnamese: "nhà trọ",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/hostel-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=hostel",
      },
      reservation: {
        vietnamese: "đặt phòng",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/reservation-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=reservation",
      },
      checkin: {
        vietnamese: "nhận phòng",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/checkin-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=checkin",
      },
      checkout: {
        vietnamese: "trả phòng",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/checkout-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=checkout",
      },

      // UNIT 5: ACADEMIC ENGLISH
      // Lesson 1: Research Terms
      hypothesis: {
        vietnamese: "giả thuyết",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/hypothesis-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=hypothesis",
      },
      methodology: {
        vietnamese: "phương pháp luận",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/methodology-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=methodology",
      },
      analysis: {
        vietnamese: "phân tích",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/analysis-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=analysis",
      },
      conclusion: {
        vietnamese: "kết luận",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/conclusion-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=conclusion",
      },
      reference: {
        vietnamese: "tài liệu tham khảo",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/reference-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=reference",
      },

      // UNIT 4: TRAVEL ENGLISH
      // Lesson 3: Sightseeing
      museum: {
        vietnamese: "bảo tàng",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/museum-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=museum",
      },
      gallery: {
        vietnamese: "phòng trưng bày",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/gallery-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=gallery",
      },
      monument: {
        vietnamese: "tượng đài",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/monument-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=monument",
      },
      park: {
        vietnamese: "công viên",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/park-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=park",
      },
      beach: {
        vietnamese: "bãi biển",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/beach-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=beach",
      },

      // Lesson 4: Dining Out
      restaurant: {
        vietnamese: "nhà hàng",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/restaurant-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=restaurant",
      },
      cafe: {
        vietnamese: "quán cà phê",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/cafe-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=cafe",
      },
      menu: {
        vietnamese: "thực đơn",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/menu-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=menu",
      },
      bill: {
        vietnamese: "hóa đơn",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/bill-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=bill",
      },

      // Lesson 5: Shopping
      market: {
        vietnamese: "chợ",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/market-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=market",
      },
      store: {
        vietnamese: "cửa hàng",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/store-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=store",
      },
      price: {
        vietnamese: "giá",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/price-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=price",
      },
      discount: {
        vietnamese: "giảm giá",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/discount-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=discount",
      },
      receipt: {
        vietnamese: "biên lai",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/receipt-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=receipt",
      },

      // UNIT 5: ACADEMIC ENGLISH
      // Lesson 2: Academic Writing
      essay: {
        vietnamese: "bài luận",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/essay-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=essay",
      },
      thesis: {
        vietnamese: "luận văn",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/thesis-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=thesis",
      },
      argument: {
        vietnamese: "lập luận",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/argument-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=argument",
      },
      evidence: {
        vietnamese: "bằng chứng",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/evidence-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=evidence",
      },
      citation: {
        vietnamese: "trích dẫn",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/citation-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=citation",
      },

      // Lesson 3: Study Skills
      "note-taking": {
        vietnamese: "ghi chú",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/note-taking-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=note-taking",
      },
      summarizing: {
        vietnamese: "tóm tắt",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/summarizing-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=summarizing",
      },
      paraphrasing: {
        vietnamese: "diễn giải",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/paraphrasing-1868750_960_720.jpg",
        audio:
          "https://audio.dict.cc/speak.audio.php?lang=en&text=paraphrasing",
      },
      memorizing: {
        vietnamese: "ghi nhớ",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/memorizing-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=memorizing",
      },
      reviewing: {
        vietnamese: "ôn tập",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/reviewing-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=reviewing",
      },

      // Lesson 4: Academic Presentations
      presentation: {
        vietnamese: "thuyết trình",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/presentation-1868750_960_720.jpg",
        audio:
          "https://audio.dict.cc/speak.audio.php?lang=en&text=presentation",
      },
      slide: {
        vietnamese: "slide",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/slide-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=slide",
      },
      audience: {
        vietnamese: "khán giả",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/audience-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=audience",
      },
      speaker: {
        vietnamese: "người nói",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/speaker-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=speaker",
      },
      feedback: {
        vietnamese: "phản hồi",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/feedback-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=feedback",
      },

      // Lesson 5: Academic Discussion
      debate: {
        vietnamese: "tranh luận",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/debate-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=debate",
      },
      discussion: {
        vietnamese: "thảo luận",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/discussion-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=discussion",
      },
      opinion: {
        vietnamese: "ý kiến",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/opinion-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=opinion",
      },
      perspective: {
        vietnamese: "góc nhìn",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/perspective-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=perspective",
      },
      consensus: {
        vietnamese: "sự đồng thuận",
        image:
          "https://cdn.pixabay.com/photo/2016/11/29/09/38/consensus-1868750_960_720.jpg",
        audio: "https://audio.dict.cc/speak.audio.php?lang=en&text=consensus",
      },
    };

    // Tạo các unit và lesson
    // UNIT 1: BEGINNER ENGLISH
    const unit1Lessons = [
      {
        title: "Basic Nouns",
        challenges: generateChallenges([
          "apple",
          "banana",
          "orange",
          "car",
          "bicycle",
        ]),
      },
      {
        title: "Colors & Numbers",
        challenges: generateChallenges([
          "red",
          "blue",
          "green",
          "yellow",
          "purple",
        ]),
      },
      {
        title: "Simple Verbs",
        challenges: generateChallenges([
          "eat",
          "drink",
          "run",
          "walk",
          "sleep",
        ]),
      },
      {
        title: "Family Members",
        challenges: generateChallenges([
          "mother",
          "father",
          "sister",
          "brother",
          "grandmother",
        ]),
      },
      {
        title: "Basic Adjectives",
        challenges: generateChallenges([
          "big",
          "small",
          "hot",
          "cold",
          "happy",
        ]),
      },
    ];

    // UNIT 2: EVERYDAY ENGLISH
    const unit2Lessons = [
      {
        title: "Greetings & Introductions",
        challenges: generateChallenges([
          "hello",
          "goodbye",
          "good morning",
          "good night",
          "how are you",
        ]),
      },
      // Thêm 4 lesson khác cho UNIT 2
      {
        title: "Food & Restaurant",
        challenges: generateChallenges([
          "apple",
          "banana",
          "orange",
          "eat",
          "drink",
        ]),
      },
      {
        title: "Shopping & Money",
        challenges: generateChallenges(["big", "small", "car", "red", "green"]),
      },
      {
        title: "Directions & Places",
        challenges: generateChallenges([
          "big",
          "small",
          "mother",
          "father",
          "hello",
        ]),
      },
      {
        title: "Time & Weather",
        challenges: generateChallenges([
          "hot",
          "cold",
          "goodbye",
          "good morning",
          "good night",
        ]),
      },
    ];

    // UNIT 3: BUSINESS ENGLISH
    const unit3Lessons = [
      {
        title: "Office Vocabulary",
        challenges: generateChallenges([
          "meeting",
          "email",
          "interview",
          "manager",
          "deadline",
        ]),
      },
      // Thêm 4 lesson khác cho UNIT 3
      {
        title: "Job Applications",
        challenges: generateChallenges([
          "interview",
          "manager",
          "email",
          "meeting",
          "deadline",
        ]),
      },
      {
        title: "Email Communication",
        challenges: generateChallenges([
          "email",
          "meeting",
          "hello",
          "goodbye",
          "manager",
        ]),
      },
      {
        title: "Presentations & Meetings",
        challenges: generateChallenges([
          "meeting",
          "manager",
          "hello",
          "goodbye",
          "email",
        ]),
      },
      {
        title: "Negotiation & Agreements",
        challenges: generateChallenges([
          "deadline",
          "meeting",
          "email",
          "manager",
          "interview",
        ]),
      },
    ];

    // UNIT 4: TRAVEL ENGLISH
    const unit4Lessons = [
      {
        title: "Transportation",
        challenges: generateChallenges([
          "airport",
          "train",
          "bus",
          "taxi",
          "subway",
        ]),
      },
      {
        title: "Accommodation",
        challenges: generateChallenges([
          "hotel",
          "hostel",
          "reservation",
          "checkin",
          "checkout",
        ]),
      },
      {
        title: "Sightseeing",
        challenges: generateChallenges([
          "museum",
          "gallery",
          "monument",
          "park",
          "beach",
        ]),
      },
      {
        title: "Dining Out",
        challenges: generateChallenges([
          "restaurant",
          "cafe",
          "menu",
          "reservation",
          "bill",
        ]),
      },
      {
        title: "Shopping",
        challenges: generateChallenges([
          "market",
          "store",
          "price",
          "discount",
          "receipt",
        ]),
      },
    ];

    // UNIT 5: ACADEMIC ENGLISH
    const unit5Lessons = [
      {
        title: "Research Terms",
        challenges: generateChallenges([
          "hypothesis",
          "methodology",
          "analysis",
          "conclusion",
          "reference",
        ]),
      },
      {
        title: "Academic Writing",
        challenges: generateChallenges([
          "essay",
          "thesis",
          "argument",
          "evidence",
          "citation",
        ]),
      },
      {
        title: "Study Skills",
        challenges: generateChallenges([
          "note-taking",
          "summarizing",
          "paraphrasing",
          "memorizing",
          "reviewing",
        ]),
      },
      {
        title: "Academic Presentations",
        challenges: generateChallenges([
          "presentation",
          "slide",
          "audience",
          "speaker",
          "feedback",
        ]),
      },
      {
        title: "Academic Discussion",
        challenges: generateChallenges([
          "debate",
          "discussion",
          "opinion",
          "perspective",
          "consensus",
        ]),
      },
    ];

    // Function to generate challenges for a list of words
    function generateChallenges(wordList) {
      const challenges = [];
      const types = ["SELECT", "ASSIST"];
      const directions = ["EN_TO_VI", "VI_TO_EN"];

      // Mỗi từ trong danh sách sẽ tạo ra 6 challenge (3 SELECT, 3 ASSIST)
      wordList.forEach((word, index) => {
        // Kiểm tra từ có trong từ điển không
        if (!vocabulary[word]) {
          console.warn(`Warning: Word "${word}" not found in vocabulary`);
          return; // Skip this word
        }

        for (let i = 0; i < 6; i++) {
          const type = types[i % 2];
          const direction = directions[i % 2]; // Luân phiên hướng dịch

          if (type === "SELECT") {
            // Tạo câu hỏi SELECT với 3 lựa chọn
            challenges.push(
              createSelectChallenge(
                direction === "EN_TO_VI"
                  ? `Select the correct meaning of '${word}'`
                  : `Chọn từ tiếng Anh của '${vocabulary[word].vietnamese}'`,
                direction === "EN_TO_VI" ? word : vocabulary[word].vietnamese,
                getRandomOptions(word, direction, 3),
                direction
              )
            );
          } else {
            // Tạo câu hỏi ASSIST với 3 lựa chọn
            challenges.push(
              createAssistChallenge(
                direction === "EN_TO_VI"
                  ? `What is the Vietnamese meaning of '${word}'?`
                  : `Từ tiếng Anh của '${vocabulary[word].vietnamese}' là gì?`,
                direction === "EN_TO_VI" ? word : vocabulary[word].vietnamese,
                direction === "EN_TO_VI" ? vocabulary[word].vietnamese : word,
                direction,
                getRandomOptions(word, direction, 3)
              )
            );
          }
        }
      });

      // Đảm bảo có ít nhất 30 challenge cho mỗi lesson
      return challenges.slice(0, 30);
    }

    // Lấy các lựa chọn ngẫu nhiên cho câu hỏi
    function getRandomOptions(correctWord, direction, count) {
      const allWords = Object.keys(vocabulary);
      const options = [];

      // Thêm lựa chọn đúng
      if (direction === "EN_TO_VI") {
        options.push(vocabulary[correctWord].vietnamese);
      } else {
        options.push(correctWord);
      }

      // Thêm các lựa chọn khác
      const shuffledWords = allWords
        .filter((word) => word !== correctWord)
        .sort(() => 0.5 - Math.random());

      for (let i = 0; i < count - 1 && i < shuffledWords.length; i++) {
        const word = shuffledWords[i];
        // Kiểm tra từ có trong từ điển không trước khi sử dụng
        if (direction === "EN_TO_VI") {
          if (vocabulary[word] && vocabulary[word].vietnamese) {
            options.push(vocabulary[word].vietnamese);
          }
        } else {
          options.push(word);
        }
      }

      // Đảm bảo đủ số lượng lựa chọn cần thiết
      while (options.length < count) {
        const randomWord =
          allWords[Math.floor(Math.random() * allWords.length)];
        if (randomWord !== correctWord) {
          if (direction === "EN_TO_VI") {
            if (
              vocabulary[randomWord] &&
              vocabulary[randomWord].vietnamese &&
              !options.includes(vocabulary[randomWord].vietnamese)
            ) {
              options.push(vocabulary[randomWord].vietnamese);
            }
          } else {
            if (!options.includes(randomWord)) {
              options.push(randomWord);
            }
          }
        }
      }

      // Trộn ngẫu nhiên các lựa chọn
      return options.sort(() => 0.5 - Math.random());
    }

    // Function lấy từ tiếng Anh từ từ tiếng Việt - Cải thiện để tìm chính xác hơn
    function getEnglishWord(vietnameseWord) {
      if (!vietnameseWord) return null;

      // Tạo map ngược từ tiếng Việt sang tiếng Anh để tra cứu nhanh
      const viToEnMap = {};
      for (const [enWord, data] of Object.entries(vocabulary)) {
        if (data && data.vietnamese) {
          viToEnMap[data.vietnamese.toLowerCase().trim()] = enWord;
        }
      }

      // Tìm kiếm chính xác
      return viToEnMap[vietnameseWord.toLowerCase().trim()] || null;
    }

    // Function to get image URL based on term
    function getImageUrl(term) {
      if (!term) return null;

      // Nếu là từ tiếng Anh
      if (vocabulary[term] && vocabulary[term].image) {
        return vocabulary[term].image;
      }

      // Nếu là từ tiếng Việt
      const enWord = getEnglishWord(term);
      if (enWord && vocabulary[enWord] && vocabulary[enWord].image) {
        return vocabulary[enWord].image;
      }

      // Fallback to placeholder
      return `https://via.placeholder.com/250?text=${encodeURIComponent(term)}`;
    }

    // Function to get audio URL based on term
    function getAudioUrl(term) {
      if (!term) return null;

      // Nếu là từ tiếng Anh
      if (vocabulary[term] && vocabulary[term].audio) {
        return vocabulary[term].audio;
      }

      // Nếu là từ tiếng Việt
      const enWord = getEnglishWord(term);
      if (enWord && vocabulary[enWord] && vocabulary[enWord].audio) {
        return vocabulary[enWord].audio;
      }

      // Fallback
      return null;
    }

    // Function tạo câu hỏi SELECT: nhiều lựa chọn để người dùng chọn
    function createSelectChallenge(question, mainWord, options, direction) {
      if (!mainWord) {
        console.warn(`Warning: mainWord is undefined in createSelectChallenge`);
        return null;
      }

      // Xác định từ hiển thị và từ đúng
      let displayTerm = mainWord;
      let correctOption = "";

      if (direction === "EN_TO_VI") {
        // Anh -> Việt: hiển thị từ tiếng Anh, đáp án đúng là tiếng Việt
        displayTerm = mainWord;
        correctOption = vocabulary[mainWord]?.vietnamese || "";
      } else {
        // Việt -> Anh: hiển thị từ tiếng Việt, cần tìm từ tiếng Anh tương ứng
        const enWord = getEnglishWord(mainWord);
        if (enWord) {
          displayTerm = enWord;
          correctOption = enWord;
        }
      }

      if (!correctOption) {
        console.warn(
          `Warning: No correct option found for ${mainWord} in ${direction} direction`
        );
      }

      // Tạo các lựa chọn (MỖI LỰA CHỌN CÓ HÌNH ẢNH VÀ ÂM THANH RIÊNG)
      const challengeOptions = [];

      for (const option of options) {
        if (!option) continue;

        // Xác định term tiếng Anh cho mỗi lựa chọn
        let optionTerm;
        let termFound = false;

        if (direction === "EN_TO_VI") {
          // Nếu đang dịch Anh -> Việt, option là tiếng Việt, cần tìm từ tiếng Anh tương ứng
          optionTerm = getEnglishWord(option);
          if (optionTerm && vocabulary[optionTerm]) {
            termFound = true;
          }
        } else {
          // Nếu đang dịch Việt -> Anh, option là tiếng Anh
          if (vocabulary[option]) {
            optionTerm = option;
            termFound = true;
          }
        }

        // Chỉ thêm option nếu tìm được term tương ứng
        if (termFound) {
          challengeOptions.push({
            text: option,
            imageSrc: vocabulary[optionTerm].image,
            audioSrc: vocabulary[optionTerm].audio,
            correct: option === correctOption,
          });
        }
      }

      // Đảm bảo luôn có đủ lựa chọn bằng cách thêm lựa chọn từ từ điển nếu thiếu
      while (challengeOptions.length < 3) {
        const randomWord =
          Object.keys(vocabulary)[
            Math.floor(Math.random() * Object.keys(vocabulary).length)
          ];

        if (!vocabulary[randomWord]) continue;

        if (direction === "EN_TO_VI") {
          const viWord = vocabulary[randomWord].vietnamese;
          // Kiểm tra xem lựa chọn này đã có trong danh sách chưa
          if (viWord && !challengeOptions.some((opt) => opt.text === viWord)) {
            challengeOptions.push({
              text: viWord,
              imageSrc: vocabulary[randomWord].image,
              audioSrc: vocabulary[randomWord].audio,
              correct: viWord === correctOption,
            });
          }
        } else {
          // Kiểm tra xem lựa chọn này đã có trong danh sách chưa
          if (
            randomWord &&
            !challengeOptions.some((opt) => opt.text === randomWord)
          ) {
            challengeOptions.push({
              text: randomWord,
              imageSrc: vocabulary[randomWord].image,
              audioSrc: vocabulary[randomWord].audio,
              correct: randomWord === correctOption,
            });
          }
        }
      }

      // Đảm bảo luôn có ít nhất một lựa chọn đúng
      let hasCorrectOption = challengeOptions.some((opt) => opt.correct);
      if (!hasCorrectOption && displayTerm && vocabulary[displayTerm]) {
        // Thêm lựa chọn đúng từ từ điển
        if (direction === "EN_TO_VI" && vocabulary[displayTerm].vietnamese) {
          challengeOptions[0] = {
            text: vocabulary[displayTerm].vietnamese,
            imageSrc: vocabulary[displayTerm].image,
            audioSrc: vocabulary[displayTerm].audio,
            correct: true,
          };
        } else {
          challengeOptions[0] = {
            text: displayTerm,
            imageSrc: vocabulary[displayTerm].image,
            audioSrc: vocabulary[displayTerm].audio,
            correct: true,
          };
        }
      }

      return {
        question: question,
        type: "SELECT",
        direction: direction,
        displayTerm: displayTerm,
        options: challengeOptions,
      };
    }

    // Function tạo câu hỏi ASSIST: Người dùng nhập đáp án, không cần hiển thị ảnh
    function createAssistChallenge(
      question,
      promptWord,
      answer,
      direction,
      options
    ) {
      if (!promptWord) {
        console.warn(
          `Warning: promptWord is undefined in createAssistChallenge`
        );
        return null;
      }

      // Xác định từ hiển thị
      let displayTerm = promptWord;

      if (direction === "EN_TO_VI") {
        // Anh -> Việt: hiển thị từ tiếng Anh
        displayTerm = promptWord;
        if (!vocabulary[displayTerm]) {
          console.warn(`Warning: Term ${displayTerm} not found in vocabulary`);
          return null;
        }
      } else {
        // Việt -> Anh: cần tìm từ tiếng Anh tương ứng
        const enWord = getEnglishWord(promptWord);
        if (enWord) {
          displayTerm = enWord;
        } else {
          console.warn(
            `Warning: No English word found for Vietnamese term ${promptWord}`
          );
          return null;
        }
      }

      // Tạo các lựa chọn (chỉ cần âm thanh, không cần hình ảnh)
      const challengeOptions = [];

      // Đảm bảo có lựa chọn đúng
      if (
        direction === "EN_TO_VI" &&
        vocabulary[displayTerm] &&
        vocabulary[displayTerm].vietnamese
      ) {
        // Anh -> Việt: đáp án đúng là tiếng Việt
        challengeOptions.push({
          text: vocabulary[displayTerm].vietnamese,
          audioSrc: vocabulary[displayTerm].audio,
          correct: true,
        });
      } else if (direction === "VI_TO_EN") {
        // Việt -> Anh: đáp án đúng là tiếng Anh
        challengeOptions.push({
          text: displayTerm,
          audioSrc: vocabulary[displayTerm].audio,
          correct: true,
        });
      }

      // Thêm các lựa chọn khác từ options
      for (const option of options) {
        if (!option || option === answer) continue; // Bỏ qua nếu là đáp án đúng (đã thêm ở trên)

        let optionTerm;
        let termFound = false;

        if (direction === "EN_TO_VI") {
          // Option là tiếng Việt, cần tìm từ tiếng Anh tương ứng
          optionTerm = getEnglishWord(option);
          if (optionTerm && vocabulary[optionTerm]) {
            termFound = true;
          }
        } else {
          // Option là tiếng Anh
          if (vocabulary[option]) {
            optionTerm = option;
            termFound = true;
          }
        }

        if (termFound && challengeOptions.length < 3) {
          challengeOptions.push({
            text: option,
            audioSrc: vocabulary[optionTerm].audio,
            correct: false,
          });
        }
      }

      // Đảm bảo đủ lựa chọn bằng cách thêm từ từ điển nếu cần
      while (challengeOptions.length < 3) {
        const randomWord =
          Object.keys(vocabulary)[
            Math.floor(Math.random() * Object.keys(vocabulary).length)
          ];

        if (!vocabulary[randomWord]) continue;
        if (randomWord === displayTerm) continue; // Bỏ qua nếu trùng với từ hiển thị

        if (direction === "EN_TO_VI" && vocabulary[randomWord].vietnamese) {
          const viWord = vocabulary[randomWord].vietnamese;
          if (!challengeOptions.some((opt) => opt.text === viWord)) {
            challengeOptions.push({
              text: viWord,
              audioSrc: vocabulary[randomWord].audio,
              correct: false,
            });
          }
        } else {
          if (!challengeOptions.some((opt) => opt.text === randomWord)) {
            challengeOptions.push({
              text: randomWord,
              audioSrc: vocabulary[randomWord].audio,
              correct: false,
            });
          }
        }
      }

      return {
        question: question,
        type: "ASSIST",
        direction: direction,
        displayTerm: displayTerm,
        options: challengeOptions,
      };
    }

    // Combine all units and lessons
    const allUnitsWithLessons = [
      { unit: units[0], lessons: unit1Lessons },
      { unit: units[1], lessons: unit2Lessons },
      { unit: units[2], lessons: unit3Lessons },
      { unit: units[3], lessons: unit4Lessons },
      { unit: units[4], lessons: unit5Lessons },
    ];

    // Process each unit, lesson, and challenge
    for (const { unit, lessons } of allUnitsWithLessons) {
      for (let lessonIndex = 0; lessonIndex < lessons.length; lessonIndex++) {
        const lessonData = lessons[lessonIndex];

        // Create lesson
        const [lesson] = await db
          .insert(schema.lessons)
          .values({
            unitId: unit.id,
            title: lessonData.title,
            order: lessonIndex + 1,
          })
          .returning();

        // Create challenges for this lesson
        for (
          let challengeIndex = 0;
          challengeIndex < lessonData.challenges.length;
          challengeIndex++
        ) {
          const challengeData = lessonData.challenges[challengeIndex];

          // Insert challenge
          const [challenge] = await db
            .insert(schema.challenges)
            .values({
              lessonId: lesson.id,
              type: challengeData.type,
              question: challengeData.question,
              direction: challengeData.direction,
              displayTerm: challengeData.displayTerm,
              order: challengeIndex + 1,
            })
            .returning();

          // Insert challenge options
          for (const option of challengeData.options) {
            await db.insert(schema.challengeOptions).values({
              challengeId: challenge.id,
              text: option.text,
              imageSrc: option.imageSrc,
              audioSrc: option.audioSrc,
              correct: option.correct,
              order: option.correct ? 1 : 2,
            });
          }
        }
      }
    }

    console.log("Database seeded successfully");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed database");
  } finally {
    await sql.end();
  }
};

void main();
