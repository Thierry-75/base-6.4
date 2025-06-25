<?php

namespace App\Service;

use App\Entity\User;
use App\Service\JwtService;
use App\Service\MailService;
use App\Message\SendActivationMessage;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use App\Form\RegistrationForm;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityNotFoundException;
use phpDocumentor\Reflection\Types\Boolean;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;



class IntraController extends AbstractController
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
    function emailValidate(User $user, JwtService $jwt, MessageBusInterface $messageBus, $subject ): void
    {
        $header = ['typ' => 'JWT', 'alg' => 'HS256'];
        $payload = ['user_id' => $user->getId()];
        $token = $jwt->generate($header, $payload, $this->getParameter('app.jwtsecret'));
        $url = $this->generateUrl('check_user', ['token' => $token], UrlGeneratorInterface::ABSOLUTE_URL);
        $messageBus->dispatch(new SendActivationMessage($this->getWebmaster(), $user->getEmail(), $subject, 'register', ['user' => $user, 'url' => $url]));
    }
}
