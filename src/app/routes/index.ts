import { Router } from 'express';
import { UserRoutes } from '../modules/users/user.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { projectRoutes } from '../modules/projects/project.routes';
import { skillsRoutes } from '../modules/skills/skills.routes';
import { BlogRoutes } from '../modules/blogs/blogs.routes';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/projects',
    route: projectRoutes,
  },
  {
    path: '/skills',
    route: skillsRoutes,
  },
  {
    path: '/blogs',
    route: BlogRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
