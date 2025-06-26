<?php

namespace App\Service;

use App\Entity\User;
use App\Service\JwtService;
use App\Message\SendActivationMessage;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;


use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;



class IntraController extends AbstractController
{
    private $webmaster = 'webmaster@my-domain.org';

    private string $folder = "avatars";

    private string $destination="null";

    private string $nomTemplate ="null";

    

    public function getWebmaster(): ?string
    {
        return $this->webmaster;
    }

    public  function getFolder(): ?string
    {
        return $this->folder;
    }

    public  function getDestination(): ?string
    {
        return $this->destination;
    }

    public function setDestination(string $destination): static
    {
        $this->destination = $destination;

        return $this;
    }

    public  function getNomTemplate(): ?string
    {
        return $this->nomTemplate;
    }

    public function setNomTemplate(string $nomTemplate): static
    {
        $this->nomTemplate = $nomTemplate;

        return $this;
    }

    static function confirmEmail($user)
    {
        if (!$user == null) {
            if ($user->isVerified() === false) {
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
    /**
     * email validation function
     *
     * @param User $user
     * @param JwtService $jwt
     * @param MessageBusInterface $messageBus
     * @param IntraController $intraController
     * @return void
     */
    function emailValidate(User $user, JwtService $jwt, MessageBusInterface $messageBus, $destination, $subject,$nomTemplate ): void
    {
        $header = ['typ' => 'JWT', 'alg' => 'HS256'];
        $payload = ['user_id' => $user->getId()];
        $token = $jwt->generate($header, $payload, $this->getParameter('app.jwtsecret'));
        $url = $this->generateUrl($destination, ['token' => $token], UrlGeneratorInterface::ABSOLUTE_URL);
        $messageBus->dispatch(new SendActivationMessage($this->getWebmaster(), $user->getEmail(), $subject, $nomTemplate, ['user' => $user, 'url' => $url]));
    }

    

}
