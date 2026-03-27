import {
  createDirectus,
  rest,
  authentication,
  createCollection,
  createField,
  readRoles,
  updateRole,
  createItem,
  readCollections,
} from "@directus/sdk";

const DIRECTUS_URL = process.env.DIRECTUS_URL || "http://localhost:8055";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

const directus = createDirectus(DIRECTUS_URL)
  .with(authentication())
  .with(rest());

async function setup() {
  console.log("🚀 Setting up Directus collections...\n");

  try {
    // Login as admin
    console.log("📝 Logging in as admin...");
    await directus.login({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
    console.log("✅ Logged in successfully\n");

    // Check existing collections
    const existingCollections = await directus.request(readCollections());
    const collectionNames = existingCollections.map((c) => c.collection);

    // Create categories collection
    if (!collectionNames.includes("categories")) {
      console.log("📁 Creating categories collection...");
      await directus.request(
        createCollection({
          collection: "categories",
          meta: {
            icon: "category",
            note: "Event categories",
            singleton: false,
          },
          schema: {},
        })
      );

      // Add fields to categories
      await directus.request(
        createField("categories", {
          field: "name",
          type: "string",
          meta: {
            interface: "input",
            required: true,
            width: "half",
          },
          schema: {
            is_nullable: false,
          },
        })
      );

      await directus.request(
        createField("categories", {
          field: "slug",
          type: "string",
          meta: {
            interface: "input",
            required: true,
            width: "half",
            note: "URL-friendly identifier",
          },
          schema: {
            is_unique: true,
            is_nullable: false,
          },
        })
      );

      console.log("✅ Categories collection created\n");
    } else {
      console.log("⏭️  Categories collection already exists\n");
    }

    // Create events collection
    if (!collectionNames.includes("events")) {
      console.log("📁 Creating events collection...");
      await directus.request(
        createCollection({
          collection: "events",
          meta: {
            icon: "event",
            note: "Events for the event management system",
            singleton: false,
          },
          schema: {},
        })
      );

      // Add fields to events
      const eventFields = [
        {
          field: "status",
          type: "string",
          meta: {
            interface: "select-dropdown",
            width: "half",
            options: {
              choices: [
                { text: "Draft", value: "draft" },
                { text: "Published", value: "published" },
                { text: "Archived", value: "archived" },
              ],
            },
          },
          schema: {
            default_value: "draft",
          },
        },
        {
          field: "title",
          type: "string",
          meta: {
            interface: "input",
            required: true,
            width: "full",
          },
          schema: {
            is_nullable: false,
          },
        },
        {
          field: "slug",
          type: "string",
          meta: {
            interface: "input",
            required: true,
            width: "half",
            note: "URL-friendly identifier (auto-generated from title)",
          },
          schema: {
            is_unique: true,
            is_nullable: false,
          },
        },
        {
          field: "description",
          type: "text",
          meta: {
            interface: "input-rich-text-html",
            width: "full",
          },
          schema: {},
        },
        {
          field: "date",
          type: "timestamp",
          meta: {
            interface: "datetime",
            required: true,
            width: "half",
          },
          schema: {
            is_nullable: false,
          },
        },
        {
          field: "location",
          type: "string",
          meta: {
            interface: "input",
            width: "half",
          },
          schema: {},
        },
        {
          field: "image",
          type: "uuid",
          meta: {
            interface: "file-image",
            width: "full",
          },
          schema: {},
        },
        {
          field: "capacity",
          type: "integer",
          meta: {
            interface: "input",
            width: "half",
            note: "Maximum number of attendees (0 = unlimited)",
          },
          schema: {
            default_value: 0,
          },
        },
        {
          field: "category",
          type: "string",
          meta: {
            interface: "input",
            width: "half",
          },
          schema: {},
        },
        {
          field: "price",
          type: "decimal",
          meta: {
            interface: "input",
            width: "half",
            note: "Price in dollars (0 = free)",
          },
          schema: {
            default_value: 0,
            numeric_precision: 10,
            numeric_scale: 2,
          },
        },
      ];

      for (const field of eventFields) {
        await directus.request(createField("events", field as never));
      }

      console.log("✅ Events collection created\n");
    } else {
      console.log("⏭️  Events collection already exists\n");
    }

    // Create registrations collection
    if (!collectionNames.includes("registrations")) {
      console.log("📁 Creating registrations collection...");
      await directus.request(
        createCollection({
          collection: "registrations",
          meta: {
            icon: "how_to_reg",
            note: "Event registrations",
            singleton: false,
          },
          schema: {},
        })
      );

      // Add fields to registrations
      await directus.request(
        createField("registrations", {
          field: "event",
          type: "integer",
          meta: {
            interface: "select-dropdown-m2o",
            required: true,
            width: "full",
            special: ["m2o"],
          },
          schema: {
            is_nullable: false,
          },
        })
      );

      await directus.request(
        createField("registrations", {
          field: "name",
          type: "string",
          meta: {
            interface: "input",
            required: true,
            width: "half",
          },
          schema: {
            is_nullable: false,
          },
        })
      );

      await directus.request(
        createField("registrations", {
          field: "email",
          type: "string",
          meta: {
            interface: "input",
            required: true,
            width: "half",
          },
          schema: {
            is_nullable: false,
          },
        })
      );

      console.log("✅ Registrations collection created\n");
    } else {
      console.log("⏭️  Registrations collection already exists\n");
    }

    // Create mentors collection
    if (!collectionNames.includes("mentors")) {
      console.log("📁 Creating mentors collection...");
      await directus.request(
        createCollection({
          collection: "mentors",
          meta: {
            icon: "school",
            note: "Mentors who provide mentoring services",
            singleton: false,
          },
          schema: {},
        })
      );

      // Add fields to mentors
      const mentorFields = [
        {
          field: "status",
          type: "string",
          meta: {
            interface: "select-dropdown",
            width: "half",
            options: {
              choices: [
                { text: "Draft", value: "draft" },
                { text: "Published", value: "published" },
                { text: "Archived", value: "archived" },
              ],
            },
          },
          schema: {
            default_value: "draft",
          },
        },
        {
          field: "name",
          type: "string",
          meta: {
            interface: "input",
            required: true,
            width: "full",
          },
          schema: {
            is_nullable: false,
          },
        },
        {
          field: "slug",
          type: "string",
          meta: {
            interface: "input",
            required: true,
            width: "half",
            note: "URL-friendly identifier",
          },
          schema: {
            is_unique: true,
            is_nullable: false,
          },
        },
        {
          field: "title",
          type: "string",
          meta: {
            interface: "input",
            width: "half",
            note: "Professional title (e.g., Senior Software Engineer)",
          },
          schema: {},
        },
        {
          field: "bio",
          type: "text",
          meta: {
            interface: "input-rich-text-html",
            width: "full",
            note: "Biography and background",
          },
          schema: {},
        },
        {
          field: "expertise",
          type: "json",
          meta: {
            interface: "tags",
            width: "full",
            note: "Areas of expertise (e.g., JavaScript, React, AI)",
          },
          schema: {},
        },
        {
          field: "image",
          type: "uuid",
          meta: {
            interface: "file-image",
            width: "full",
            note: "Profile photo",
          },
          schema: {},
        },
        {
          field: "linkedin",
          type: "string",
          meta: {
            interface: "input",
            width: "half",
            note: "LinkedIn profile URL",
          },
          schema: {},
        },
        {
          field: "twitter",
          type: "string",
          meta: {
            interface: "input",
            width: "half",
            note: "Twitter/X profile URL",
          },
          schema: {},
        },
        {
          field: "availability",
          type: "string",
          meta: {
            interface: "select-dropdown",
            width: "half",
            options: {
              choices: [
                { text: "Available", value: "available" },
                { text: "Limited", value: "limited" },
                { text: "Not Available", value: "unavailable" },
              ],
            },
          },
          schema: {
            default_value: "available",
          },
        },
        {
          field: "max_mentees",
          type: "integer",
          meta: {
            interface: "input",
            width: "half",
            note: "Maximum number of mentees (0 = unlimited)",
          },
          schema: {
            default_value: 5,
          },
        },
        {
          field: "years_experience",
          type: "integer",
          meta: {
            interface: "input",
            width: "half",
            note: "Years of professional experience",
          },
          schema: {},
        },
      ];

      for (const field of mentorFields) {
        await directus.request(createField("mentors", field as never));
      }

      console.log("✅ Mentors collection created\n");
    } else {
      console.log("⏭️  Mentors collection already exists\n");
    }

    // Create mentor_registrations collection
    if (!collectionNames.includes("mentor_registrations")) {
      console.log("📁 Creating mentor_registrations collection...");
      await directus.request(
        createCollection({
          collection: "mentor_registrations",
          meta: {
            icon: "connect_without_contact",
            note: "User registrations with mentors",
            singleton: false,
          },
          schema: {},
        })
      );

      // Add fields to mentor_registrations
      const registrationFields = [
        {
          field: "mentor",
          type: "integer",
          meta: {
            interface: "select-dropdown-m2o",
            required: true,
            width: "full",
            special: ["m2o"],
            note: "The mentor being registered with",
          },
          schema: {
            is_nullable: false,
          },
        },
        {
          field: "name",
          type: "string",
          meta: {
            interface: "input",
            required: true,
            width: "half",
          },
          schema: {
            is_nullable: false,
          },
        },
        {
          field: "email",
          type: "string",
          meta: {
            interface: "input",
            required: true,
            width: "half",
          },
          schema: {
            is_nullable: false,
          },
        },
        {
          field: "message",
          type: "text",
          meta: {
            interface: "input-multiline",
            width: "full",
            note: "Why they want mentoring / what they hope to learn",
          },
          schema: {},
        },
        {
          field: "status",
          type: "string",
          meta: {
            interface: "select-dropdown",
            width: "half",
            options: {
              choices: [
                { text: "Pending", value: "pending" },
                { text: "Accepted", value: "accepted" },
                { text: "Declined", value: "declined" },
              ],
            },
          },
          schema: {
            default_value: "pending",
          },
        },
      ];

      for (const field of registrationFields) {
        await directus.request(
          createField("mentor_registrations", field as never)
        );
      }

      console.log("✅ Mentor registrations collection created\n");
    } else {
      console.log("⏭️  Mentor registrations collection already exists\n");
    }

    // Create hero_section singleton collection
    if (!collectionNames.includes("hero_section")) {
      console.log("📁 Creating hero_section collection (singleton)...");
      await directus.request(
        createCollection({
          collection: "hero_section",
          meta: {
            icon: "stars",
            note: "Homepage hero section content",
            singleton: true,
          },
          schema: {},
        })
      );

      // Add fields to hero_section
      const heroFields = [
        {
          field: "title",
          type: "string",
          meta: {
            interface: "input",
            required: true,
            width: "full",
            note: "Main headline",
          },
          schema: {
            is_nullable: false,
          },
        },
        {
          field: "subtitle",
          type: "text",
          meta: {
            interface: "input-multiline",
            width: "full",
            note: "Supporting text below the title",
          },
          schema: {},
        },
        {
          field: "button_text",
          type: "string",
          meta: {
            interface: "input",
            width: "half",
            note: "CTA button label",
          },
          schema: {
            default_value: "Browse All Events",
          },
        },
        {
          field: "button_link",
          type: "string",
          meta: {
            interface: "input",
            width: "half",
            note: "CTA button URL",
          },
          schema: {
            default_value: "/events",
          },
        },
        {
          field: "background_image",
          type: "uuid",
          meta: {
            interface: "file-image",
            width: "full",
            note: "Optional background image",
          },
          schema: {},
        },
      ];

      for (const field of heroFields) {
        await directus.request(createField("hero_section", field as never));
      }

      // Create initial hero content
      try {
        await directus.request(
          createItem("hero_section" as never, {
            title: "Discover Amazing Events",
            subtitle:
              "Find and register for conferences, workshops, meetups, and more. Join our community of learners and innovators.",
            button_text: "Browse All Events",
            button_link: "/events",
          } as never)
        );
        console.log("✅ Hero section created with default content\n");
      } catch {
        console.log("✅ Hero section collection created\n");
      }
    } else {
      console.log("⏭️  Hero section collection already exists\n");
    }

    // Set up public role permissions
    console.log("🔐 Setting up permissions...");
    const roles = await directus.request(readRoles());
    const publicRole = roles.find((r) => r.name === "Public");

    if (publicRole) {
      // Note: Permissions setup requires direct API calls
      // For now, we'll log instructions
      console.log(`
⚠️  Please set up permissions manually in Directus Admin:

1. Go to Settings → Access Control → Public
2. Add permissions:
   - events: Read (filter: status = 'published')
   - categories: Read
   - hero_section: Read

For the API token (to create registrations):
1. Go to Settings → Access Tokens
2. Create a new static token
3. Add to .env.local: DIRECTUS_API_TOKEN=your-token
4. Set permissions for the token user:
   - events: Read
   - categories: Read
   - registrations: Create
`);
    }

    // Create sample categories
    console.log("📝 Creating sample categories...");
    const sampleCategories = [
      { name: "Conference", slug: "conference" },
      { name: "Workshop", slug: "workshop" },
      { name: "Meetup", slug: "meetup" },
      { name: "Webinar", slug: "webinar" },
    ];

    for (const cat of sampleCategories) {
      try {
        await directus.request(createItem("categories" as never, cat as never));
        console.log(`  ✅ Created category: ${cat.name}`);
      } catch {
        console.log(`  ⏭️  Category ${cat.name} may already exist`);
      }
    }

    console.log("\n🎉 Setup complete!");
    console.log("\nNext steps:");
    console.log("1. Set up permissions in Directus Admin (see above)");
    console.log("2. Create an API token and add to .env.local");
    console.log("3. Create some test events in Directus");
    console.log("4. Run: npm run dev");
  } catch (error) {
    console.error("❌ Setup failed:", error);
    process.exit(1);
  }
}

setup();
