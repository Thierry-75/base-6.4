<?php

namespace App\Service;


class IntraController
{
    private $webmaster = 'webmaster@my-domain.org';

    private ?string $folder = "avatars";

    public function getWebmaster(): ?string
    {
        return $this->webmaster;
    }

    public  function getFolder(): ?string
    {
        return $this->folder;
    }

    static function confirmEmail($user)
    {
        if (!$user == null) {
            if ($user->isVerified()  == false) {
                return true;
            }
        }
    }
    static function completeCoordonnees($user)
    {
        if (!$user == null) {
            if ($user->isVerified() === true && $user->isFull() === false) {
                return true;
            }
        }
    }
}
