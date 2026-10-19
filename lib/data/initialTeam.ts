import { TeamMember } from "@/types";

export const INITIAL_TEAM: TeamMember[] = [
  {
    id: "team-1",
    name: "Ar. Hamid MM",
    role: "Founding Principal Architect",
    image: "/team/hamid.jpg",
    bio: "Co-founded Zero Studio in 2013. A visionary architect whose charismatic spirit and passion for material honesty established the fundamental philosophies of the studio.",
    order: 1,
    visible: true,
  },
  {
    id: "team-2",
    name: "Ar. Hafeef PK",
    role: "Founding Principal Architect",
    image: "/team/hafeef.jpg",
    bio: "Co-founded Zero Studio in 2013. Instrumental in driving the studio's early experimental projects, vernacular exploration, and adaptive ecological architecture.",
    order: 2,
    visible: true,
  },
  {
    id: "team-3",
    name: "Ar. Shabna",
    role: "Lead Principal Architect",
    image: "/team/shabna.jpg",
    bio: "Currently steering Zero Studio's design direction, focusing on nuanced residential and spatial interventions that dialogue seamlessly with regional climate and craft.",
    order: 3,
    visible: true,
  },
  {
    id: "team-4",
    name: "Ar. Nidhinraj KJ",
    role: "Lead Principal Architect",
    image: "/team/nidhinraj.jpg",
    bio: "Leads technical design and architectural discourse at Zero Studio, emphasizing tectonics, passive microclimatic cooling, and honest vernacular construction.",
    order: 4,
    visible: true,
  },
];
