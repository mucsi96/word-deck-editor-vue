import { takeScreenshot } from '../session';


export const upload = async ({ session, editCourseUrl, deck }) => {
  await session.go('https://www.memrise.com/login/');
  await takeScreenshot(session);
};
