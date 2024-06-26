import React, { useState, useEffect } from 'react';
import axios from '../../Components/auth/axios';
import { confirmAlert } from 'react-confirm-alert';
import { useNavigate, Link } from 'react-router-dom';
import 'react-confirm-alert/src/react-confirm-alert.css';
//import DeleteUserForm from './delete-user-form';
import UpdatePasswordForm from './update-password-form';
import UpdateProfileInformationForm from './update-profile-information-form';

const EditProfile = ({ isAuthenticated, user, logout }) => {
  const [items, setItems] = useState([]);
  const [profileImage, setProfileImage] = useState('profilepictures/user-2.png');
  const [isAdmin, setIsAdmin] = useState(false); // Neu hinzugefügt
  const [error, setError] = useState(null);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [showAds, setShowAds] = useState(false); // Neu hinzugefügt
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      axios.get('/user/items')
        .then(response => {
          setItems(response.data);
        })
        .catch(error => {
          setError(error.response ? error.response.data.error : 'Error loading user data');
        });

      // Abrufen der Benutzerdaten, um zu überprüfen, ob der Benutzer ein Admin ist
      axios.get('/user')
        .then(response => {
          setIsAdmin(response.data.is_admin === 1); // Überprüfung des is_admin-Flags
          setProfileImage(response.data.profile_image || 'profilepictures/user-2.png');
        })
        .catch(error => {
          setError(error.response ? error.response.data.error : 'Error loading user data');
        });
    }
  }, [isAuthenticated]);

  const handleImageChange = async (e) => {
    const formData = new FormData();
    formData.append('profile_image', e.target.files[0]);

    try {
      const response = await axios.post('/profile/picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfileImage(response.data.profile_image);
    } catch (error) {
      console.error("Error updating profile picture", error);
    }
  };

  const confirmDelete = (itemId) => {
    confirmAlert({
      title: 'Bestätigung erforderlich',
      message: 'Sind Sie sicher, dass Sie diesen Artikel löschen möchten?',
      buttons: [
        {
          label: 'Ja',
          onClick: () => handleDelete(itemId)
        },
        {
          label: 'Nein',
          onClick: () => {}
        }
      ]
    });
  };

  const handleDelete = async (itemId) => {
    try {
      await axios.delete(`/items/${itemId}`);
      setItems(items.filter(item => item.id !== itemId));
    } catch (error) {
      console.error("Error deleting item", error.response ? error.response.data : error.message);
    }
  };

  if (!user && !error) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="py-4">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
        <div className="mt-4 px-5 flex items-center">
          <img src={`http://localhost:8000/storage/${profileImage}`} alt="Aktuelles Bild" className="br-profile-picture profile-image ml-2" />
          <div className="flex flex-col px-5 ml-2">
            <span className="content-text py-5">Hallo, {user.name} </span>
            <form id="uploadForm" method="POST" encType="multipart/form-data">
              <input type="file" id="profile_image_input" name="profile_image" className="hidden" onChange={handleImageChange} />
              <button type="button" onClick={() => document.getElementById('profile_image_input').click()} className="x-button">
                Bild ändern
              </button>
            </form>
          </div>
        </div>

        <div className="py-4">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
            <div>
              <button 
                className="w-full flex items-center justify-between px-4 py-2 text-left h3-text light-color hover:accent-colour rounded-md"
                onClick={() => setShowProfileSettings(!showProfileSettings)}
              >
                <span>Profileinstellungen</span>
              </button>
              {showProfileSettings && (
                <div className="p-4 mt-2 base-color-light rounded-lg">
                  <UpdateProfileInformationForm user={user} />
                  <UpdatePasswordForm />
        
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <button 
            className="w-full flex items-center justify-between px-4 py-2 text-left h3-text light-color hover:accent-colour rounded-md"
            onClick={() => setShowAds(!showAds)}
          >
            <span>Meine Anzeigen</span>
          </button>
          {showAds && (
            <div className="py-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {items.length > 0 ? (
                items.map((item) => (
                  <div key={item.id} className="light-color rounded-lg overflow-hidden shadow">
                    <img src={`http://localhost:8000/storage/photos/${item.photo}`} alt={item.title} className="w-full h-20 object-cover" />
                    <div className="p-2">
                      <h5 className="h3-text text-center">{item.title}</h5>
                      <div className="mt-2">
                        <button onClick={() => navigate(`/items/${item.id}/edit`)} className="btn btn-primary justify-center content-text-small w-full mb-2">Bearbeiten</button>
                        <button type="button" onClick={() => confirmDelete(item.id)} className="justify-center content-text-small btn btn-danger w-full">Löschen</button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>Keine Anzeigen gefunden.</p>
              )}
            </div>
          )}
        </div>

        {isAdmin && ( // Admin-Schaltfläche anzeigen, wenn Benutzer ein Admin ist
          <div>
            <Link to="/admin/dashboard" className="w-full flex items-center justify-between px-4 py-2 text-left h3-text light-color hover:accent-colour rounded-md">
              <span>Admin Dashboard</span>
            </Link>
          </div>
        )}

        <div className="p-4 sm:p-8 base-color-light">
          <div className="max-w-xl">
            <button onClick={logout} className="content-text py-2 px-4 br-buttons light-color">Logout</button>
          </div>
          <div className="mb-20"></div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
