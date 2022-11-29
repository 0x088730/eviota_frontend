import { Routes, Route, Outlet, Link } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { Header, UnauthenticatedHeader, PageLoader, ProtectedComponent } from '../components'
import { LandingPage, Dashboard, Profile, FindTeacher, Wallet, CreateBooking, ContactUs, TeacherProfile, Support, CardDecks, Cards } from '../pages'

export default function Router() {
  const { isLoading, isAuthenticated } = useAuth0();
  return (
    <Routes>
      {
        (isLoading) 
        ? <Route path="*" element={<PageLoader />} /> 
        : <Route path="/" element={
            <>
              {
                (!isAuthenticated)
                ? <UnauthenticatedHeader />
                : <Header />
              }
              <Outlet />
            </>
          }>
            {/* Unauthenticated */}
            <Route index element={<LandingPage />} />
            {/* <Route path="about" element={<About />} /> */}
            <Route path="contact-us" element={<ContactUs />} />
            
            {/* Authenticated */}
            <Route path="dashboard" element={<ProtectedComponent component={Dashboard} />} />
            <Route path="teachers" element={<ProtectedComponent component={FindTeacher} />} />
            <Route path="teacher-profile/:id" element={<ProtectedComponent component={TeacherProfile} />} />
            <Route path="profile" element={<ProtectedComponent component={Profile} />} />
            <Route path="wallet" element={<ProtectedComponent component={Wallet} />} />
            <Route path="support" element={<ProtectedComponent component={Support} />} />
            <Route path="card-decks" element={<ProtectedComponent component={CardDecks} />} />
            <Route path="card-decks/:id" element={<ProtectedComponent component={Cards} />} />
            <Route path="new-booking/:id" element={<ProtectedComponent component={CreateBooking} />} />
          </Route>
      }

      {/* catch-all */}
      <Route path="*" element={<NoMatch />} />
    </Routes>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Page not found.</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  )
}
